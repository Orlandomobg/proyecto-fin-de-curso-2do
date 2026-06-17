from pydantic import BaseModel


class PredictionInput(BaseModel):
    lat: float
    lon: float
    slope: float      # inclinación del panel (grados)
    azimuth: float    # orientación del panel (convención del entrenamiento: PVGIS, 0 = Sur)


class PredictionOutput(BaseModel):
    status: str
    hora_local: str
    watts: float
    weather: dict