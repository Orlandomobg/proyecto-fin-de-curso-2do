package com.example.solaris.data.model

// ---- Solar resource ----
data class SolarResourceRequest(val latitude: Double, val longitude: Double)

data class SolarResourceResponse(
    val monthly_ghi_kwh_m2: Map<String, Double>,
    val annual_ghi_kwh_m2: Double,
    val peak_sun_hours_daily: Double,
    val monthly_temperature_c: Map<String, Double>,
    val monthly_cloud_cover_pct: Map<String, Double>,
    val source: String
)

// ---- System design ----
data class SystemDesignRequest(
    val latitude: Double,
    val longitude: Double,
    val area_usable_m2: Double,
    val surface_type: String,
    val panel_area_m2: Double,
    val panel_power_watt: Double
)

data class SystemDesignResponse(
    val optimal_tilt_degree: Double,
    val optimal_azimut_degree: Double,
    val number_panels: Int,
    val installed_pwr_kwp: Double
)

// ---- Production / Financial (comparten el mismo body) ----
data class StudyRequest(val property_id: String, val panel_id: String)

data class ProductionResponse(
    val monthly_generation_kwh: Map<String, Double>,
    val annual_generation_kwh: Double,
    val monthly_panel_temperature_c: Map<String, Double>,
    val monthly_efficiency_loss_pct: Map<String, Double>,
    val total_loss_pct: Double,
    val loss_if_deviated_pct: Double,
    val degradation_by_year: Map<String, Double>,
    val peak_month: String,
    val lowest_month: String,
    val source: String
)

data class FinancialResponse(
    val annual_self_consumption_kwh: Double,
    val annual_grid_export_kwh: Double,
    val annual_grid_import_kwh: Double,
    val self_sufficiency_pct: Double,
    val cost_low: Double,
    val cost_mid: Double,
    val cost_high: Double,
    val annual_savings_eur: Double,
    val annual_exports_income_eur: Double,
    val annual_net_benefit_eur: Double,
    val payback_years: Double,
    val npv_eur: Double,
    val annual_cashflow: Map<String, Double>,
    val savings_10_years: Double,
    val savings_20_years: Double,
    val savings_25_years: Double,
    val co2_avoided_kg_year: Double,
    val co2_avoided_lifetime_kg: Double,
    val equivalent_trees: Double,
    val equivalent_km_car: Double
)

// ---- ML en tiempo real ----
data class RealtimeRequest(
    val latitude: Double,
    val longitude: Double,
    val slope: Double,
    val azimuth: Double
)

data class WeatherInfo(
    val temp_c: Double,
    val wind_ms: Double,
    val ghi_w_m2: Double,
    val poa_direct_w_m2: Double
)

data class RealtimeResponse(
    val status: String,
    val hora_local: String,
    val watts: Double,
    val weather: WeatherInfo
)