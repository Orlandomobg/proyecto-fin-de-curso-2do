import httpx
from app.utils.settings import settings
from datetime import date, timedelta

async def get_nasa_power_data(latitude: float, longitude: float) -> dict: 
    params = {
        "parameters": "T2M,ALLSKY_SFC_SW_DWN",
        "community": "re",
        "longitude": longitude,
        "latitude": latitude,
        "format": "JSON",
        "temporal-average": "climatology"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(settings.NASA_POWER_BASE_URL, params=params)
            response.raise_for_status()
            return response.json()
    
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise Exception("NASA POWER: URL no encontrada")
        else:
            raise Exception(f"NASA POWER error: {e.response.status_code}")
      
    except Exception as e:
        raise Exception(f"Error inesperado: {str(e)}")
    

async def get_open_meteo_data(latitude: float, longitude: float):
    yesterday = date.today() - timedelta(days=1) 
    yesterday = str(yesterday)

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": "2000-01-01",
        "end_date": yesterday,
        "daily": "cloud_cover_mean",
        "timezone" : "UTC" 
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(settings.OPEN_GEO_BASE_URL, params=params)
            if response.status_code != 200:
                print(f"DEBUG Open-Meteo Error: {response.text}")
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        raise Exception(f"Error inesperado: {str(e)}")
    

async def get_pvgis_optimal_angle (latitude:float,longitude:float,surface_type:str):
    params= {
        "lat" : latitude,
        "lon" : longitude,
        "mountingplace" : surface_type,
        "peakpower" : 1,
        "optimalangles" : 1, 
        "loss": 14,
        "outputformat": "json"
    }
    PV_CALC_URL = f"{settings.PVGIS_BASE_URL}/PVcalc"

    try: 
        async with httpx.AsyncClient(timeout=15.0) as client: 
            response = await client.get(PV_CALC_URL,params = params)
            if response.status_code != 200: 
                print(f"PVGIS error: {response.text}")
            response.raise_for_status()
            return response.json()
    
    except Exception as e: 
        raise Exception (f"Unexpected error:{str(e)}")