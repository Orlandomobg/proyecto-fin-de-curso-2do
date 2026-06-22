package com.example.solaris.data.model

data class Panel(
    val id: String,
    val brand: String,
    val model: String,
    val power_watt: String,
    val efficiency_percentage: String,
    val area_m2: String,
    val price_unit: String,
    val degradation_rate_year: String,
    val lifespan_years: Int,
    val noct_celsius: String,
    val temp_coefficient: String,
    val inverter_efficiency_pct: String,
    val wiring_losses_pct: String
) {
    fun powerWattAsDouble() = power_watt.toDoubleOrNull() ?: 0.0
}