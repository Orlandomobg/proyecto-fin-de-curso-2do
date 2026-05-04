from fastapi import APIRouter, HTTPException
from app.models.solar_models import systemDesignInput,systemDesignOutput
from app.services.external_apis import get_pvgis_optimal_angle

router = APIRouter()

@router.post("/",response_model=systemDesignOutput)
async def get_system_design(data:systemDesignInput):
    try:
        pvgis_data =  await get_pvgis_optimal_angle(data.latitude,data.longitude,data.surface_type)

        params = pvgis_data["inputs"]["mounting_system"]["fixed"]
        optimal_tilt_angle = params["slope"]["value"]
        optimal_azimuth_angle = params["azimuth"]["value"] + 180

        # 0.85 es factor de ocupación(espacio entre cada panel dentro de la superficie usable)
        number_of_panels = int(data.area_usable_m2 *0.85/data.panel_area_m2)

        installed_power_kwp= number_of_panels * data.panel_power_watt / 1000

        return systemDesignOutput(
            optimal_tilt_degree = optimal_tilt_angle,
            optimal_azimut_degree = optimal_azimuth_angle,
            number_panels = number_of_panels,
            installed_pwr_kwp = installed_power_kwp,
            source= "PVGIS"
        )

    except Exception as e: 
        raise HTTPException(status_code= 500,detail= str(e))