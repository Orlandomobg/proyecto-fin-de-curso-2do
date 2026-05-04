from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()
modelo = joblib.load('modelo_solar.pkl')

class DatosEntrada(BaseModel):
    radiacion: float
    temp: float
    viento: float

@app.post("/predecir")
async def predecir(input: DatosEntrada):
    # Usamos los nombres de columnas con los que entrenaste para evitar el Warning
    df = pd.DataFrame([[input.radiacion, input.temp, input.viento]], 
                      columns=['G_total', 'T2m', 'WS10m'])
    
    prediccion_watts = modelo.predict(df)[0]
    
    # Convertimos a kW para que el Node no se vuelva loco (600W -> 0.6kW)
    return {"potencia_base": float(prediccion_watts / 1000)}