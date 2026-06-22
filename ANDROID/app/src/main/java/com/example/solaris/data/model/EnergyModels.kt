package com.example.solaris.data.model

data class EnergyConsumption(
    val id: String,
    val property_id: String,
    val annual_kwh: String,
    val month: Int?,
    val year: Int?,
    val consumption_kwh: String?,
    val energy_source: String?
)

data class EnergyConsumptionRequest(
    val property_id: String,
    val annual_kwh: Double,
    val month: Int,
    val year: Int,
    val consumption_kwh: Double,
    val energy_source: String
)

data class AnnualEnergyResponse(
    val property_id: String,
    val annual_kwh: String
)