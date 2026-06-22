package com.example.solaris.data.model

// Postgres devuelve los NUMERIC como String -> los campos numéricos son String aquí.
data class Property(
    val id: String,
    val user_id: String,
    val address: String,
    val latitude: String,
    val longitude: String,
    val area_total_m2: String,
    val area_usable_m2: String,
    val surface_type: String, // "free" | "building"
    val orientation_degree: String,
    val tilt_angle_degree: String,
    val shading_factor: String,
    val roof_material: String,
    val electricity_price_eur_kwh: String,
    val compensation_price_eur_kwh: String,
    val annual_maintenance_eur: String,
    val created_at: String,
    val deleted_at: String?
) {
    // helpers para convertir a Double cuando se necesite calcular/mostrar
    fun latitudeAsDouble() = latitude.toDoubleOrNull() ?: 0.0
    fun longitudeAsDouble() = longitude.toDoubleOrNull() ?: 0.0
}

// Para crear/editar SÍ se manda como número real en el JSON.
data class PropertyRequest(
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val area_total_m2: Double,
    val area_usable_m2: Double,
    val surface_type: String,
    val orientation_degree: Double,
    val tilt_angle_degree: Double,
    val shading_factor: Double,
    val roof_material: String,
    val electricity_price_eur_kwh: Double,
    val compensation_price_eur_kwh: Double,
    val annual_maintenance_eur: Double
)