const { getPanelDataId, getPropertiesId } = require("../models/production.model")
const { getSolarResource, getSystemDesign, getProduction } = require("../services/solarEngine.service")

const getProductionController = async (req, res) => {
    try {
        const { property_id, panel_id } = req.body

        const errors = []
        if (!property_id) errors.push("property_id is required")
        if (!panel_id) errors.push("panel_id is required")
        if (errors.length > 0) return res.status(400).json({ errors })

            
        const panel = await getPanelDataId(panel_id)
        const property = await getPropertiesId(property_id)

        if (!panel) return res.status(404).json({ error: "Panel not found" })
        if (!property) return res.status(404).json({ error: "Property not found" })


        const solarResource = await getSolarResource(
            property.latitude,
            property.longitude
        )


        const systemDesign = await getSystemDesign(
            property.latitude,
            property.longitude,
            property.area_usable_m2,
            property.surface_type,
            panel.area_m2,
            panel.power_watt
        )

        const payload = {
            monthly_ghi_kwh_m2: solarResource.monthly_ghi_kwh_m2,
            monthly_temperature_c: solarResource.monthly_temperature_c,
            peak_sun_hours_daily: solarResource.peak_sun_hours_daily,
            number_panels: systemDesign.number_panels,
            installed_pwr_kwp: systemDesign.installed_pwr_kwp,
            optimal_tilt_degree: systemDesign.optimal_tilt_degree,
            optimal_azimut_degree: systemDesign.optimal_azimut_degree,
            real_tilt_degree: parseFloat(property.tilt_angle_degree),
            real_azimuth_degree: parseFloat(property.orientation_degree),
            panel_power_watt: parseFloat(panel.power_watt),
            noct_celsius: parseFloat(panel.noct_celsius),
            efficiency_percentage: parseFloat(panel.efficiency_percentage),
            degradation_rate_year: parseFloat(panel.degradation_rate_year),
            temp_coefficient: parseFloat(panel.temp_coefficient),
            shading_factor: parseFloat(property.shading_factor)
        }

        const result = await getProduction(payload)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { getProductionController }