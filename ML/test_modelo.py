import joblib
import numpy as np

# 1. Cargamos el "cerebro" que creaste recién
modelo = joblib.load('modelo_solar.pkl')

# 2. Imaginemos que una API de clima nos da estos datos de una ubicación X:
# [Radiación total, Temperatura, Viento]
datos_clima_api = np.array([[500, 15, 5]]) 

# 3. Le pedimos la predicción
prediccion = modelo.predict(datos_clima_api)

print(f"Para esos datos de clima, la generación será de: {prediccion[0]:.2f} Watts")