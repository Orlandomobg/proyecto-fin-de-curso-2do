from pydantic import BaseModel 
from typing import Literal

class ProductionInput (BaseModel): 
    #solar_resource
    monthly_ghi_kwh_m2: dict
    monthly_temperature_c: dict
    peak_sun_hours_daily: float 

    #system_design
    number_panels: int
    installed_pwr_kwp: float
    optimal_tilt_degree: float
    optimal_azimut_degree: float
    real_tilt_degree: float     
    real_azimuth_degree: float

    #panel(postgre)
    panel_power_watt: float
    noct_celsius: float
    efficiency_percentage: float
    degradation_rate_year: float
    temp_coefficient: float

    #property(postgre)
    shading_factor: float

class ProductionOutput(BaseModel):

    #production
    monthly_generation_kwh: dict
    annual_generation_kwh: float

    #temp
    monthly_panel_temperature_c: dict
    monthly_efficiency_loss_pct: dict

    #loss
    total_loss_pct: float
    loss_if_deviated_pct: float

    #degradation
    degradation_by_year: dict

    #resume
    peak_month: str
    lowest_month: str

    #source
    source: str