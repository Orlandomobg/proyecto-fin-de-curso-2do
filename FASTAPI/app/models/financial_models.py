from pydantic import BaseModel

class FinancialInput (BaseModel):
    # annual generation
    annual_generation_kwh: float
    degradation_by_year: dict

    # from user (db)
    annual_consumption_kwh: float

    # economics
    installed_power_kwp: float
    electricity_price_eur_kwh: float
    compensation_price_eur_kwh: float 
    annual_maintenance_eur: float

    # financial
    discount_rate: float
    horizon_years: int

    #others
    roof_type: str
    has_battery: bool              
    battery_kwh: float 

class FinancialOutput (BaseModel):
    # energy
    annual_self_consumption_kwh: float
    annual_grid_export_kwh: float
    annual_grid_import_kwh: float
    self_sufficiency_pct: float

    # basics economics
    cost_low: float  
    cost_mid: float
    cost_high: float
    
    annual_savings_eur: float
    annual_exports_income_eur: float
    annual_net_benefit_eur: float

    # ROI (return of investments)
    payback_years: float
    npv_eur: float  #net present value
    annual_cashflow: dict

    #accumulated
    savings_10_years: float
    savings_20_years: float 
    savings_25_years: float

    #environmental
    co2_avoided_kg_year: float
    co2_avoided_lifetime_kg: float 
    equivalent_trees: float
    equivalent_km_car: float

