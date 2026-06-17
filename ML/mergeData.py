"""
Construye el dataset universal a partir de una carpeta de CSVs de PVGIS.
Extrae lat/lon/slope/azimuth de las cabeceras y los inyecta como columnas.

Uso:
    python mergeData.py <carpeta_entrada> <archivo_salida.csv>
o con variables de entorno:
    PVGIS_INPUT_DIR=... PVGIS_OUTPUT_CSV=... python mergeData.py
"""
import pandas as pd
import glob
import os
import re
import sys


def crear_super_dataset(directorio_entrada, archivo_salida):
    archivos = glob.glob(os.path.join(directorio_entrada, "*.csv"))
    lista_df = []

    print(f"Detectados {len(archivos)} archivos. Iniciando procesamiento...")

    for path in archivos:
        nombre_archivo = os.path.basename(path)
        try:
            with open(path, "r") as f:
                header_content = "".join([f.readline() for _ in range(12)])

            lat = float(re.search(r"Latitude \(decimal degrees\):\s+([-?\d.]+)", header_content).group(1))
            lon = float(re.search(r"Longitude \(decimal degrees\):\s+([-?\d.]+)", header_content).group(1))
            slope = float(re.search(r"Slope:\s+([\d.]+)", header_content).group(1))
            azimuth_match = re.search(r"Azimuth:\s+([-?\d.]+)", header_content)
            azimuth = float(azimuth_match.group(1)) if azimuth_match else 0.0

            df = pd.read_csv(path, skiprows=10, skipfooter=10, engine="python")
            df["lat"] = lat
            df["lon"] = lon
            df["slope"] = slope
            df["azimuth"] = azimuth

            lista_df.append(df)
            print(f"Procesado: {nombre_archivo} -> Lat: {lat}, Slope: {slope}, Az: {azimuth}")

        except Exception as e:
            print(f"Error en archivo {nombre_archivo}: {e}")

    if not lista_df:
        print("No se pudo procesar ningún archivo.")
        return

    df_final = pd.concat(lista_df, ignore_index=True)
    columnas_ordenadas = ["lat", "lon", "slope", "azimuth", "Gb(i)", "Gd(i)", "Gr(i)", "T2m", "WS10m", "P"]
    df_final = df_final[columnas_ordenadas]
    df_final.to_csv(archivo_salida, index=False)
    print(f"\nDataset universal creado en: {archivo_salida}")
    print(f"Total de registros: {len(df_final)}")


if __name__ == "__main__":
    input_dir = sys.argv[1] if len(sys.argv) > 1 else os.getenv("PVGIS_INPUT_DIR", "./dataEntrenamiento")
    output_csv = sys.argv[2] if len(sys.argv) > 2 else os.getenv("PVGIS_OUTPUT_CSV", "./dataset_solar_final.csv")
    crear_super_dataset(input_dir, output_csv)