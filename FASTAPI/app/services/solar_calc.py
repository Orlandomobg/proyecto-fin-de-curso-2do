import math

MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
DAYS_PER_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31]

def temp_panel(monthly_temp_c: dict, monthly_ghi: dict, noct: float) -> dict:
    result = {}
    for i, month in enumerate(MONTH_NAMES):
        days = DAYS_PER_MONTH[i]
        ghi_daily = monthly_ghi.get(month, 0) / days
        t_amb = monthly_temp_c.get(month, 0)
        t_panel = t_amb + ((noct - 20) / 800) * ghi_daily
        result[month] = round(t_panel, 2)
    return result

def loss_temp(monthly_panel_temp: dict, temp_coefficient: float) -> dict:
    result = {}
    for month in MONTH_NAMES:
        t_panel = monthly_panel_temp.get(month, 25)
        loss = temp_coefficient * (t_panel - 25) * 100 # formato de porcentaje, no decimal.
        result[month] = round(loss, 4)
    return result

def monthly_generation(installed_power_kwp: float, monthly_loss: dict, shading_factor: float, monthly_ghi: dict) -> dict:
    result = {}
    for i, month in enumerate(MONTH_NAMES):
        days = DAYS_PER_MONTH[i]
        ghi_daily = monthly_ghi.get(month, 0) / days
        loss = monthly_loss.get(month, 0) / 100 # aqui si decimal.
        gen = installed_power_kwp * (1 + loss) * (1 - shading_factor) * ghi_daily * days
        result[month] = round(gen, 2)
    return result

def total_loss(monthly_loss: dict, shading_factor: float) -> float:
    avg_temp_loss = sum(monthly_loss.values()) / len(monthly_loss)
    total = avg_temp_loss + (shading_factor * 100) # porcentaje
    return round(abs(total), 2)

def deviation_loss(optimal_tilt: float, optimal_azimuth: float, real_tilt: float, real_azimuth: float) -> float:
    tilt_diff = math.radians(abs(optimal_tilt - real_tilt))
    azimuth_diff = math.radians(abs(optimal_azimuth - real_azimuth))
    factor = math.cos(tilt_diff) * math.cos(azimuth_diff)
    loss = (1 - factor) * 100
    return round(loss, 2)

def degradation(annual_gen: float, degradation_rate: float) -> dict:
    result = {}
    gen_year1 = annual_gen * (1 - 0.015)
    result[1] = round(gen_year1, 2)
    for year in range(2, 26):
        gen = gen_year1 * ((1 - degradation_rate / 100) ** (year - 1))
        result[year] = round(gen, 2)
    return result