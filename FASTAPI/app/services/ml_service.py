import joblib
import pandas as pd
import numpy as np
import pvlib
import httpx
from pathlib import Path
from datetime import datetime
from app.utils.settings import settings

# Columnas EXACTAS y en el MISMO ORDEN con que se entrenó el modelo universal.
# (ver ML/modelo.py y ML/mergeData.py)
FEATURE_COLUMNS = ["lat", "lon", "slope", "azimuth", "Gb(i)", "Gd(i)", "Gr(i)", "T2m", "WS10m"]

_model = None


def _resolve_model_path() -> Path:
    if settings.ML_MODEL_PATH:
        return Path(settings.ML_MODEL_PATH)
    # por defecto: FASTAPI/app/ml/modelo_solar_universal.pkl
    return Path(__file__).resolve().parents[1] / "ml" / "modelo_solar_universal.pkl"


def model_available() -> bool:
    return _resolve_model_path().exists()


def load_model():
    """Carga perezosa: el modelo se lee del disco una sola vez."""
    global _model
    if _model is None:
        path = _resolve_model_path()
        if not path.exists():
            raise FileNotFoundError(f"Modelo no encontrado en {path}")
        _model = joblib.load(path)
    return _model


async def _get_open_meteo_now(lat: float, lon: float) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,wind_speed_10m",
        "hourly": "shortwave_radiation,direct_radiation,diffuse_radiation",
        "timezone": "auto",
        "forecast_days": 1,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(settings.OPEN_METEO_FORECAST_URL, params=params)
        resp.raise_for_status()
        return resp.json()


async def predict_realtime(lat: float, lon: float, slope: float, azimuth: float) -> dict:
    model = load_model()
    data = await _get_open_meteo_now(lat, lon)

    # hora actual -> índice en la serie horaria (fallback: hora del sistema)
    hora_actual = datetime.now().strftime("%Y-%m-%dT%H:00")
    try:
        idx = data["hourly"]["time"].index(hora_actual)
    except (ValueError, KeyError):
        idx = datetime.now().hour

    temp = float(data["current"]["temperature_2m"])
    viento = float(data["current"]["wind_speed_10m"])
    ghi = float(data["hourly"]["shortwave_radiation"][idx])
    direct_h = float(data["hourly"]["direct_radiation"][idx])
    diffuse_h = float(data["hourly"]["diffuse_radiation"][idx])

    # geometría solar (pvlib)
    site = pvlib.location.Location(lat, lon)
    solpos = site.get_solarposition(pd.Timestamp.now(tz="UTC"))
    zenith = float(solpos["zenith"].iloc[0])
    azimuth_sol = float(solpos["azimuth"].iloc[0])

    cos_zenith = np.cos(np.radians(zenith))
    dni = direct_h / cos_zenith if zenith < 87 else 0.0

    # POA: irradiancia que recibe el panel inclinado
    poa = pvlib.irradiance.get_total_irradiance(
        surface_tilt=slope,
        surface_azimuth=azimuth,
        dni=max(0.0, dni),
        ghi=ghi,
        dhi=diffuse_h,
        solar_zenith=zenith,
        solar_azimuth=azimuth_sol,
    )

    df_input = pd.DataFrame([{
        "lat": lat, "lon": lon, "slope": slope, "azimuth": azimuth,
        "Gb(i)": float(poa["poa_direct"]),
        "Gd(i)": float(poa["poa_diffuse"]),
        "Gr(i)": float(poa["poa_ground_diffuse"]),
        "T2m": temp, "WS10m": viento,
    }])[FEATURE_COLUMNS]

    watts = float(model.predict(df_input)[0])

    return {
        "status": "success",
        "hora_local": hora_actual,
        "watts": round(max(0.0, watts), 2),
        "weather": {
            "temp_c": temp,
            "wind_ms": viento,
            "ghi_w_m2": ghi,
            "poa_direct_w_m2": round(float(poa["poa_direct"]), 2),
        },
    }