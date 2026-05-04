from fastapi import APIRouter, HTTPException
from app.models.production_models import ProductionInput, ProductionOutput
from app.services import solar_calc

router = APIRouter()

@router.post("/", response_model=ProductionOutput)
async def get_production(data: ProductionInput):
    try:
        monthly_temp = solar_calc.temp_panel(
            data.monthly_temperature_c,
            data.monthly_ghi_kwh_m2,
            data.noct_celsius
        )

        monthly_loss = solar_calc.loss_temp(
            monthly_temp,
            data.temp_coefficient
        )

        monthly_gen = solar_calc.monthly_generation(
            data.installed_pwr_kwp,
            monthly_loss,
            data.shading_factor,
            data.monthly_ghi_kwh_m2
        )

        annual_gen = sum(monthly_gen.values())

        total_loss = solar_calc.total_loss(monthly_loss, data.shading_factor)

        loss_deviated = solar_calc.deviation_loss(
            data.optimal_tilt_degree,
            data.optimal_azimut_degree,
            data.real_tilt_degree,
            data.real_azimuth_degree
        )

        degradation = solar_calc.degradation(annual_gen, data.degradation_rate_year)

        peak_month = max(monthly_gen, key=monthly_gen.get)
        
        lowest_month = min(monthly_gen, key=monthly_gen.get)

        return ProductionOutput(
            monthly_generation_kwh=monthly_gen,
            annual_generation_kwh=round(annual_gen, 2),
            monthly_panel_temperature_c=monthly_temp,
            monthly_efficiency_loss_pct=monthly_loss,
            total_loss_pct=total_loss,
            loss_if_deviated_pct=loss_deviated,
            degradation_by_year=degradation,
            peak_month=peak_month,
            lowest_month=lowest_month,
            source="NASA POWER + PVGIS"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))