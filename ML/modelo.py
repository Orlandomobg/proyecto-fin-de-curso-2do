#NOTA: TE SIRVE PARA SABER LOS WATTS DE CARA A FUTURO. MA SPARA PARTE DE PRODUCCION
# Entrenamiento de donde sace el csv https://re.jrc.ec.europa.eu/pvg_tools/en/#api_5.3

"""
Entrena el modelo universal (RandomForest) y lo guarda como .pkl.

Uso:
    python modelo.py <dataset.csv> <salida.pkl>
o con variables de entorno:
    DATASET_CSV=... MODEL_OUT=... python modelo.py

Por defecto guarda en ../FASTAPI/app/ml/modelo_solar_universal.pkl
(la ruta donde la FastAPI lo busca).
"""
import os
import sys
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

FEATURES = ["lat", "lon", "slope", "azimuth", "Gb(i)", "Gd(i)", "Gr(i)", "T2m", "WS10m"]
TARGET = "P"

DEFAULT_MODEL_OUT = os.path.join(
    os.path.dirname(__file__), "..", "FASTAPI", "app", "ml", "modelo_solar_universal.pkl"
)



def entrenar(ruta_csv, salida_pkl):
    print(f"Cargando dataset: {ruta_csv}")
    df = pd.read_csv(ruta_csv).dropna()

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Entrenando con {len(X_train)} filas...")

    modelo = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        n_jobs=-1,
        random_state=42,
        verbose=1,
    )
    modelo.fit(X_train, y_train)

    os.makedirs(os.path.dirname(os.path.abspath(salida_pkl)), exist_ok=True)
    joblib.dump(modelo, salida_pkl)

    y_pred = modelo.predict(X_test)
    print(f"\nModelo guardado en: {salida_pkl}")
    print(f"R2 Score: {r2_score(y_test, y_pred):.4f}")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f} Watts")


if __name__ == "__main__":
    ruta_csv = sys.argv[1] if len(sys.argv) > 1 else os.getenv("DATASET_CSV", "./ML/dataset_solar_final.csv")
    salida_pkl = sys.argv[2] if len(sys.argv) > 2 else os.getenv("MODEL_OUT", DEFAULT_MODEL_OUT)
    entrenar(ruta_csv, salida_pkl)