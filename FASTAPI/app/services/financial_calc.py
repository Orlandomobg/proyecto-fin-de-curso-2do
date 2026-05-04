def calculate_autoconsumption (annual_generation_kwh: float, annual_consumption_kwh:float): 
    generation = annual_generation_kwh
    consumption = annual_consumption_kwh
    autoconsumption = min(generation, consumption)
    excess = generation - autoconsumption
    energy_imported = consumption - autoconsumption
    sufficiency = (autoconsumption / consumption) * 100

    return {
        "self_consumption_kwh": autoconsumption,
        "grid_export_kwh": excess,
        "grid_import_kwh": energy_imported,
        "self_sufficiency_pct": sufficiency
    }

def calculate_installation_cost (installed_power_kwp: float,roof_type: str,has_battery: bool, battery_kwh:float):
    kwp = installed_power_kwp
    # range per components
    panels_low = kwp * 400
    panels_mid = kwp * 550
    panels_high = kwp * 700 

    # investor
    investor_low= kwp * 150
    investor_mid= kwp * 225
    investor_high= kwp * 300

    # structure
    structure_low = kwp * 100
    structure_mid = kwp * 175
    structure_high = kwp * 250

    #labour
    labour_low = kwp * 200
    labour_mid = kwp * 300
    labour_high = kwp * 400

    #fixed cost
    legalize = 500 # standard price 
    engineering = 400

    # total per scenary
    total_low = panels_low + investor_low + structure_low + labour_low + legalize + engineering
    total_mid = panels_mid + investor_mid + structure_mid + labour_mid + legalize + engineering
    total_high = panels_high + investor_high + structure_high + labour_high + legalize + engineering

    #adjust per complexity of the roof
    if roof_type == "complex":
        total_low *= 1.15
        total_mid *= 1.20
        total_high *= 1.30

    # has battery ??
    if has_battery: 
        total_low += battery_kwh * 500
        total_mid += battery_kwh * 700
        total_high += battery_kwh * 900

    cost_breakdown ={
        "panels_low" :panels_low, 
        "panels_mid" : panels_mid, 
        "panels_high": panels_high,
        "investor_low" : investor_low, 
        "investor_mid" : investor_mid,
        "investor_high": investor_high,
        "structure_low" : structure_low,
        "structure_mid" : structure_mid,
        "structure_high" : structure_high,
        "labour_low" : labour_low,
        "labour_mid" : labour_mid,
        "labour_high" : labour_high 
    }
    return {
        "cost_low": total_low,
        "cost_mid": total_mid,   # costes a usar en calculate_NPV
        "cost_high" : total_high,
        "components" : cost_breakdown
    }
    
def calculate_annual_savings (self_consuption_kwh : float,grid_export_kwh:float,electricity_price_eur_kwh:float,compensation_price_eur_kwh: float,annual_maintenance_eur:float ):

    buy_savings = self_consuption_kwh * electricity_price_eur_kwh
    selling_income = grid_export_kwh * compensation_price_eur_kwh # destacar que esto es para bajar factura 

    gross_profit = buy_savings + selling_income
    net_profit = gross_profit - annual_maintenance_eur

    return {
        "annual_savings_eur": buy_savings,
        "annual_export_income_eur": selling_income,
        "annual_net_benefit_eur" : net_profit 
    }

def calculate_NPV (installation_cost_eur: float,degradation_by_year: dict ,electricity_price_eur_kwh: float, discount_rate: float, horizon_years: int,annual_comsumption_kwh: float,compensation_price_eur_kwh:float, annual_maintenance_eur:float): # Net Profit Value

    # initial investment (cashflow)
    cf_0 = -installation_cost_eur
    npv = cf_0
    annual_cf = {}

    #cashflow per year(with degradation)
    for year in range(1,horizon_years + 1): 
        gen_year =  degradation_by_year[str(year)]
        self_consumption_per_year= min(gen_year,annual_comsumption_kwh)
        surplus_year= gen_year - self_consumption_per_year

        cf_year = (self_consumption_per_year * electricity_price_eur_kwh) + (surplus_year * compensation_price_eur_kwh) - annual_maintenance_eur
        
        annual_cf[year] = cf_year

        # NPV
        cf_discounted = cf_year/((1+discount_rate)**year)
        npv += cf_discounted

    accumulated  = 0 
    payback_years = None 
    for year in range(1,horizon_years + 1): 
        accumulated+= annual_cf[year]
        if accumulated >= installation_cost_eur and payback_years is None:
            payback_years = year

    return {
        "npv_eur":round(npv,2),
        "payback_years": payback_years,
        "annual_cashflow": annual_cf
        }

def calculate_accumulated(annual_cf: dict, installation_cost_eur: float):
    
    accumulated_10 = sum([annual_cf.get(year, 0) for year in range(1, 11)]) - installation_cost_eur
    accumulated_20 = sum([annual_cf.get(year, 0) for year in range(1, 21)]) - installation_cost_eur
    accumulated_25 = sum([annual_cf.get(year, 0) for year in range(1, 26)]) - installation_cost_eur

    return {
        "savings_10_years": round(accumulated_10, 2),
        "savings_20_years": round(accumulated_20, 2),
        "savings_25_years": round(accumulated_25, 2)
    }

def calculate_co2(annual_generation_kwh: float,horizon_years: int,degradation_by_year: dict): 

    # emission factor co2, 0.233 kg/kwh (luego incluir la api para valor en tiempo real)
    CO2_FACTOR = 0.233

    co2_year = annual_generation_kwh * CO2_FACTOR
    co2_total = sum([degradation_by_year[str(year)] for year in range(1, horizon_years +1 )]) * CO2_FACTOR

    #equivalent
    trees = co2_year / 21 # kgs trees absorbs of co2 per year
    km_car = co2_year / 0.120 # mean value on car emmisions co2/km

    return {
    "co2_avoided_kg_year": round(co2_year, 2),
    "co2_avoided_lifetime_kg": round(co2_total, 2),
    "equivalent_trees": round(trees, 1),
    "equivalent_km_car": round(km_car, 2)
}