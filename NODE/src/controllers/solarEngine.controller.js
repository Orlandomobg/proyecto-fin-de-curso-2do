const { getSolarResource, getSystemDesign, getRealtimePrediction } = require("../services/solarEngine.service")
const { getPropertiesId } = require("../models/production.model")

const getSolarResourceController = async (req, res) => {
    try {
        const { latitude, longitude } = req.body

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "latitude and longitude are required" })
        }

        const data = await getSolarResource(latitude, longitude)
        return res.status(200).json(data)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getSystemDesignController = async (req, res) => {
    try {
        const { latitude, longitude, area_usable_m2, surface_type, panel_area_m2, panel_power_watt } = req.body

        const requiredFields = { latitude, longitude, area_usable_m2, surface_type, panel_area_m2, panel_power_watt }

        const errors = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => `${key} is required`)

        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        const data = await getSystemDesign(latitude, longitude, area_usable_m2, surface_type, panel_area_m2, panel_power_watt)
        res.status(200).json(data)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

// Predicción ML "ahora mismo". Dos modos:
//  - crudo: body con { latitude, longitude, slope, azimuth }
//  - por propiedad: body con { property_id }  -> rellena datos desde Postgres
const getRealtimePredictionController = async (req, res) => {
    try {
        let { latitude, longitude, slope, azimuth, property_id } = req.body

        if (property_id) {
            const property = await getPropertiesId(property_id)
            if (!property) return res.status(404).json({ error: "Property not found" })

            latitude = property.latitude
            longitude = property.longitude
            slope = slope ?? parseFloat(property.tilt_angle_degree)
            // OJO convención azimuth: el modelo se entrenó con azimuth de PVGIS (0 = Sur).
            // property.orientation_degree es 0-360 con 0 = Norte. Si los resultados
            // salen raros, probablemente haya que convertir: azimuth = orientation - 180.
            azimuth = azimuth ?? parseFloat(property.orientation_degree)
        }

        if (latitude == null || longitude == null || slope == null || azimuth == null) {
            return res.status(400).json({
                error: "latitude, longitude, slope y azimuth son requeridos (o un property_id)"
            })
        }

        const data = await getRealtimePrediction(latitude, longitude, slope, azimuth)
        return res.status(200).json(data)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { getSolarResourceController, getSystemDesignController, getRealtimePredictionController }