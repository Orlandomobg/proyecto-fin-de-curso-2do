from fastapi import APIRouter, HTTPException
from app.models.financial_models import FinancialInput, FinancialOutput
from app.services import financial_calc

router = APIRouter()

@router.post("/", response_model=FinancialOutput)
async def get_financial(data: FinancialInput):
    try:
        # self consumption
        autoconsumption = financial_calc.calculate_autoconsumption(
            data.annual_generation_kwh,
            data.annual_consumption_kwh
        )

        # 2. installation cost
        installation_cost = financial_calc.calculate_installation_cost(
            data.installed_power_kwp,
            data.roof_type,
            data.has_battery,
            data.battery_kwh
        )

        # 3. annual saving
        annual_savings = financial_calc.calculate_annual_savings(
            autoconsumption["self_consumption_kwh"],
            autoconsumption["grid_export_kwh"],
            data.electricity_price_eur_kwh,
            data.compensation_price_eur_kwh,
            data.annual_maintenance_eur
        )

        # 4. Net profit value
        npv_result = financial_calc.calculate_NPV(
            installation_cost["cost_mid"],
            data.degradation_by_year,
            data.electricity_price_eur_kwh,
            data.discount_rate,
            data.horizon_years,
            data.annual_consumption_kwh,
            data.compensation_price_eur_kwh,
            data.annual_maintenance_eur
        )

        # 5. accumulated
        accumulated = financial_calc.calculate_accumulated(
            npv_result["annual_cashflow"],
            installation_cost["cost_mid"]
        )

        # 6. CO2
        co2 = financial_calc.calculate_co2(
            data.annual_generation_kwh,
            data.horizon_years,
            data.degradation_by_year
        )

        # Output
        return FinancialOutput(
            annual_self_consumption_kwh=autoconsumption["self_consumption_kwh"],
            annual_grid_export_kwh=autoconsumption["grid_export_kwh"],
            annual_grid_import_kwh=autoconsumption["grid_import_kwh"],
            self_sufficiency_pct=autoconsumption["self_sufficiency_pct"],
            
            cost_low=installation_cost["cost_low"],
            cost_mid=installation_cost["cost_mid"],
            cost_high=installation_cost["cost_high"],
            
            annual_savings_eur=annual_savings["annual_savings_eur"],
            annual_exports_income_eur=annual_savings["annual_export_income_eur"],
            annual_net_benefit_eur=annual_savings["annual_net_benefit_eur"],
            
            payback_years=npv_result["payback_years"],
            npv_eur=npv_result["npv_eur"],
            annual_cashflow=npv_result["annual_cashflow"],
            
            savings_10_years=accumulated["savings_10_years"],
            savings_20_years=accumulated["savings_20_years"],
            savings_25_years=accumulated["savings_25_years"],
            
            co2_avoided_kg_year=co2["co2_avoided_kg_year"],
            co2_avoided_lifetime_kg=co2["co2_avoided_lifetime_kg"],
            equivalent_trees=co2["equivalent_trees"],
            equivalent_km_car=co2["equivalent_km_car"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))