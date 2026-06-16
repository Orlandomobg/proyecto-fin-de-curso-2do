from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    NASA_POWER_BASE_URL: str = "https://power.larc.nasa.gov/api/temporal/monthly/point"
    OPEN_GEO_BASE_URL: str = "https://archive-api.open-meteo.com/v1/archive"
    PVGIS_BASE_URL: str  = "https://re.jrc.ec.europa.eu/api/v5_3"
    ML_MODEL_PATH: str = "app/ml/modelo_solar_universal.pkl"
    NODE_URL: str = "http://localhost:4000/api"
    OPEN_METEO_FORECAST_URL: str = "https://api.open-meteo.com/v1/forecast"
    
    class Config:
        env_file = ".env"

settings = Settings()