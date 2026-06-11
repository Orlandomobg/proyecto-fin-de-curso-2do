import asyncio
import httpx
from app.utils.settings import settings
from datetime import date, timedelta


async def _get_json(url, params, timeout=15.0, retries=3, backoff=1.0, label="API externa"):
    """GET con reintentos para fallos transitorios (timeouts, 5xx, 429).
    Los 4xx (salvo 429) no se reintentan: son errores de la petición, no del servidor."""
    for attempt in range(1, retries + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.get(url, params=params)

            if resp.status_code < 400:
                return resp.json()

            # 4xx (salvo 429) -> no tiene sentido reintentar
            if resp.status_code < 500 and resp.status_code != 429:
                raise Exception(f"{label}: error {resp.status_code} - {resp.text[:200]}")

            # 5xx o 429 -> transitorio, forzamos reintento
            raise httpx.HTTPError(f"{label}: {resp.status_code}")

        except httpx.HTTPError as e:
            if attempt == retries:
                raise Exception(f"{label}: sin respuesta tras {retries} intentos ({e})")
            await asyncio.sleep(backoff * attempt)  # espera progresiva: 1s, 2s...


async def get_nasa_power_data(latitude: float, longitude: float) -> dict:
    params = {
        "parameters": "T2M,ALLSKY_SFC_SW_DWN",
        "community": "re",
        "longitude": longitude,
        "latitude": latitude,
        "format": "JSON",
        "temporal-average": "climatology",
    }
    return await _get_json(settings.NASA_POWER_BASE_URL, params, timeout=30.0, label="NASA POWER")


async def get_open_meteo_data(latitude: float, longitude: float):
    yesterday = str(date.today() - timedelta(days=1))
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": "2000-01-01",
        "end_date": yesterday,
        "daily": "cloud_cover_mean",
        "timezone": "UTC",
    }
    return await _get_json(settings.OPEN_GEO_BASE_URL, params, timeout=20.0, label="Open-Meteo")


async def get_pvgis_optimal_angle(latitude: float, longitude: float, surface_type: str):
    params = {
        "lat": latitude,
        "lon": longitude,
        "mountingplace": surface_type,
        "peakpower": 1,
        "optimalangles": 1,
        "loss": 14,
        "outputformat": "json",
    }
    pv_calc_url = f"{settings.PVGIS_BASE_URL}/PVcalc"
    return await _get_json(pv_calc_url, params, timeout=20.0, label="PVGIS")