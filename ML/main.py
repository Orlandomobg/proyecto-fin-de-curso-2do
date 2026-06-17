from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import pvlib
import requests
from datetime import datetime
import os

app = FastAPI(title="API Universal Solar Fotovoltaica")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. CARGA DEL MODELO COMPATIBLE CON LA ESTRUCTURA DE CARPETAS
# Busca el .pkl dentro de la carpeta 'ml' esté donde esté parado el servidor
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUTA_MODELO = os.path.join(BASE_DIR, "ml", "modelo_solar_universal.pkl")

try:
    # Si por alguna razón el archivo quedó suelto en la raíz de la API, búscalo ahí
    if not os.path.exists(RUTA_MODELO):
        RUTA_MODELO = os.path.join(BASE_DIR, "modelo_solar_universal.pkl")
        
    modelo = joblib.load(RUTA_MODELO)
    print("✅ Modelo Universal cargado exitosamente desde:", RUTA_MODELO)
except Exception as e:
    print(f"❌ Error crítico al cargar el modelo: {e}")
    modelo = None

class DatosEntrada(BaseModel):
    lat: float
    lon: float
    slope: float
    azimuth: float

@app.post("/predecir")
async def predecir(input: DatosEntrada):
    if modelo is None:
        raise HTTPException(status_code=500, detail="El modelo de IA (.pkl) no está cargado en el servidor.")
        
    try:
        # 2. CONSULTA A OPEN-METEO
        url_om = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={input.lat}&longitude={input.lon}&"
            f"current=temperature_2m,wind_speed_10m&"
            f"hourly=shortwave_radiation,direct_radiation,diffuse_radiation&"
            f"timezone=auto&forecast_days=1"
        )
        
        res = requests.get(url_om).json()
        
        # 3. ENCONTRAR LA HORA ACTUAL EN LA LISTA HOURLY
        hora_actual = datetime.now().strftime("%Y-%m-%dT%H:00")
        try:
            idx = res['hourly']['time'].index(hora_actual)
        except (ValueError, KeyError):
            idx = datetime.now().hour # Fallback simple por posición horaria lineal

        # Extraemos los datos de esa hora específica
        temp = float(res['current']['temperature_2m'])
        viento = float(res['current']['wind_speed_10m'])
        ghi = float(res['hourly']['shortwave_radiation'][idx])
        direct_h = float(res['hourly']['direct_radiation'][idx])
        diffuse_h = float(res['hourly']['diffuse_radiation'][idx])

        # 4. PVLIB (Geometría Solar con huso horario controlado)
        site = pvlib.location.Location(input.lat, input.lon)
        solpos = site.get_solarposition(pd.Timestamp.now(tz='UTC'))
        zenith = float(solpos['zenith'].iloc[0])
        azimuth_sol = float(solpos['azimuth'].iloc[0])

        # Cálculo de DNI (Direct Normal) evitando división por cero en el horizonte
        cos_zenith = np.cos(np.radians(zenith))
        dni = direct_h / cos_zenith if (zenith < 87 and cos_zenith > 0) else 0

        # POA (Radiación que recibe el panel inclinado)
        poa = pvlib.irradiance.get_total_irradiance(
            surface_tilt=input.slope,
            surface_azimuth=input.azimuth,
            dni=max(0, float(dni)),
            ghi=ghi,
            dhi=diffuse_h,
            solar_zenith=zenith,
            solar_azimuth=azimuth_sol
        )

        # 5. DATAFRAME DE ALTA PRECISIÓN PARA EL MODELO
        # Forzamos las columnas exactas tal cual se entrenaron
        columnas = ["lat", "lon", "slope", "azimuth", "Gb(i)", "Gd(i)", "Gr(i)", "T2m", "WS10m"]
        datos = [[
            input.lat, input.lon, input.slope, input.azimuth,
            float(poa['poa_direct']), float(poa['poa_diffuse']), float(poa['poa_ground_diffuse']),
            temp, viento
        ]]
        
        df_input = pd.DataFrame(datos, columns=columnas)

        # Ejecutamos la predicción de IA
        pred_watts = modelo.predict(df_input)[0]

        return {
            "status": "success",
            "hora_local": hora_actual,
            "watts": round(max(0, float(pred_watts)), 2),
            "clima_debug": {
                "temp_celsius": temp,
                "viento_kmh": viento,
                "ghi_suelo": ghi,
                "directa_panel_poa": round(float(poa['poa_direct']), 2),
                "difusa_panel_poa": round(float(poa['poa_diffuse']), 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo en el cálculo: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Levantamos en la dirección local estándar para desarrollo
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)