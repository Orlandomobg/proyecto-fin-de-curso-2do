import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Entrenamiento de donde sace el csv https://re.jrc.ec.europa.eu/pvg_tools/en/#api_5.3
# ==========================================
# 1. CONFIGURACIÓN DE RUTA (DIRECTO A DOWNLOADS)
# ==========================================

# Usamos la ruta exacta que me pasaste
ruta_csv = r"C:\Users\coco\Downloads\Timeseries_40.424_-3.690_SA3_1kWp_crystSi_14_36deg_-5deg_2019_2023.csv"

print(f"Intentando cargar el archivo desde: {ruta_csv}")

# ==========================================
# 2. CARGA Y LIMPIEZA DE DATOS
# ==========================================

try:
    # Cargamos el CSV saltando los encabezados de PVGIS
    # engine='python' es necesario para que funcione bien el skipfooter
    df = pd.read_csv(ruta_csv, skiprows=10, skipfooter=12, engine='python')
    
    # Limpiamos espacios en blanco en los nombres de las columnas
    df.columns = [col.strip() for col in df.columns]
    
    # Creamos la radiación total sumando las componentes
    df['G_total'] = df['Gb(i)'] + df['Gd(i)'] + df['Gr(i)']
    
    # Filtramos: solo nos interesan las horas donde hay sol
    df_solar = df[df['G_total'] > 0].copy()
    
    # Variables de entrada (X) y lo que queremos predecir (y)
    # G_total: Irradiación | T2m: Temperatura | WS10m: Viento
    features = ['G_total', 'T2m', 'WS10m']
    target = 'P'
    
    X = df_solar[features]
    y = df_solar[target]
    
    # ==========================================
    # 3. ENTRENAMIENTO DEL MODELO
    # ==========================================
    
    # Dividimos 80% entrenamiento y 20% test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Entrenando la IA (esto tomará unos segundos)...")
    modelo = RandomForestRegressor(n_estimators=100, random_state=42)
    modelo.fit(X_train, y_train)
    
    # ==========================================
    # 4. GUARDAR EL MODELO Y RESULTADOS
    # ==========================================
    
    # Guardamos el "cerebro" en la carpeta donde estás corriendo el script
    joblib.dump(modelo, 'modelo_solar.pkl')
    
    # Calculamos el error para ver qué tan bueno es
    predicciones = modelo.predict(X_test)
    error = mean_absolute_error(y_test, predicciones)
    
    print("\n--- ¡MODELO ENTRENADO CON ÉXITO! ---")
    print(f"Error promedio: {error:.2f} Watts")
    print("El archivo 'modelo_solar.pkl' ha sido creado.")
    
    # Una prueba rápida: 800W de sol, 20 grados, 3m/s de viento
    test_data = np.array([[800, 20, 3]])
    prediccion_test = modelo.predict(test_data)
    print(f"\nEjemplo de predicción: Con 800W de sol generará {prediccion_test[0]:.2f} Watts")

except FileNotFoundError:
    print(f"\nERROR: No se encontró el archivo en {ruta_csv}")
    print("Verifica que el nombre en la carpeta de Descargas sea EXACTAMENTE el mismo.")
except Exception as e:
    print(f"\nOcurrió un error: {e}")

from sklearn.metrics import r2_score, mean_absolute_error

# 1. Supongamos que tienes X_test (clima) y y_test (potencia real que ya conoces)
# Le pedimos a la IA que intente adivinar la potencia basándose en X_test
y_pred = modelo.predict(X_test)

# 2. Calculamos la "nota" (R2 Score)
score = r2_score(y_test, y_pred)

# 3. Calculamos el error medio (MAE) - Esto te dice cuántos Watts suele fallar
error_medio = mean_absolute_error(y_test, y_pred)

print(f"Nota del modelo (R2 Score): {score:.4f}")
print(f"Error promedio: {error_medio:.2f} Watts")