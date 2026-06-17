from fastapi import APIRouter, HTTPException
from app.models.prediction_models import PredictionInput, PredictionOutput
from app.services import ml_service

router = APIRouter()


@router.post("/", response_model=PredictionOutput)
async def get_realtime_prediction(data: PredictionInput):
    if not ml_service.model_available():
        raise HTTPException(
            status_code=503,
            detail="Modelo ML no disponible: falta app/ml/modelo_solar_universal.pkl",
        )
    try:
        return await ml_service.predict_realtime(data.lat, data.lon, data.slope, data.azimuth)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))