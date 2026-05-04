from fastapi import APIRouter, HTTPException
from app.models.solar_models import SolarResourcesInput,SolarResourcesOutput
from app.services.external_apis import get_nasa_power_data,get_open_meteo_data

router = APIRouter()

MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

@router.post("/",response_model = SolarResourcesOutput)
async def get_solar_resource(data:SolarResourcesInput):
    try:
        nasa_data = await get_nasa_power_data(data.latitude,data.longitude)
        open_meteo_data = await get_open_meteo_data(data.latitude,data.longitude)

        # nasa
        params = nasa_data["properties"]["parameter"]
        ghi_raw = params["ALLSKY_SFC_SW_DWN"]
        temp_raw = params["T2M"]

        monthly_ghi={}
        monthly_temp={}
        annual_ghi=0.0

        for month in MONTH_NAMES:
            ghi_daily = ghi_raw.get(month.upper(), 0)
            temp = temp_raw.get(month.upper(), 0)
            days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][MONTH_NAMES.index(month)]
            monthly_ghi[month] = round(ghi_daily * days, 2)
            monthly_temp[month] = round(temp, 2)
            annual_ghi += monthly_ghi[month]

        peak_sun_hours = round(ghi_raw.get("ANN", 0), 2)

        # open geo
        cloud_stats = {month: {"sum": 0.0, "count": 0} for month in MONTH_NAMES}
        
        if open_meteo_data and "daily" in open_meteo_data:
            times = open_meteo_data["daily"]["time"]
            clouds = open_meteo_data["daily"]["cloud_cover_mean"]

            for date_str, cloud_val in zip(times, clouds):
                if cloud_val is not None:
                    month_idx = int(date_str.split("-")[1]) - 1
                    m_name = MONTH_NAMES[month_idx]
                    cloud_stats[m_name]["sum"] += cloud_val
                    cloud_stats[m_name]["count"] += 1

        monthly_cloud = {}
        for month in MONTH_NAMES:
            stats = cloud_stats[month]
            monthly_cloud[month] = round(stats["sum"] / stats["count"], 1) if stats["count"] > 0 else 0.0


        return SolarResourcesOutput( 
            monthly_ghi_kwh_m2 = monthly_ghi,
            annual_ghi_kwh_m2 = round(annual_ghi, 2),
            peak_sun_hours_daily = peak_sun_hours,
            monthly_temperature_c = monthly_temp,
            monthly_cloud_cover_pct = monthly_cloud,
            source = "NASA POWER & Open-Meteo"
        )

    except Exception as e:
        raise HTTPException(status_code= 500, detail= str(e))

