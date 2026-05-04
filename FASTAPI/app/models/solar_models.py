from pydantic import BaseModel 
from typing import Literal

#solar resources
class SolarResourcesInput(BaseModel):
    latitude: float
    longitude: float

class SolarResourcesOutput(BaseModel):
    # GHI: Global Horizontal Irradiance(cantidad de sol que se recibe por m2 de superficie horizontal.)
    monthly_ghi_kwh_m2: dict
    annual_ghi_kwh_m2: float
    peak_sun_hours_daily: float 
    monthly_temperature_c: dict
    monthly_cloud_cover_pct: dict
    #donde vienen los datos.
    source: str

#system design
class systemDesignInput(BaseModel):
    latitude: float
    longitude: float
    area_usable_m2: float
    surface_type: Literal["free", "building"]
    panel_area_m2: float
    panel_power_watt: float

class systemDesignOutput(BaseModel):
    optimal_tilt_degree: float
    optimal_azimut_degree: float
    number_panels: int
    installed_pwr_kwp: float
    source: str