const { getPanelDataId, getPropertiesId } = require("../models/production.model")
const { getAnnualEnergyByPropertyId } = require("../models/energy.model")
const { getSolarResource, getSystemDesign, getProduction, getFinancial } = require("../services/solarEngine.service")

const getFinancialController = async (req, res) => {
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

        // consumo anual real desde energy_consumptions (fallback 5000 si aún no hay datos)
        const annualConsumption = Number(await getAnnualEnergyByPropertyId(property_id)) || 5000

        const solarResource = await getSolarResource(property.latitude, property.longitude)
        const systemDesign = await getSystemDesign(
            property.latitude,
            property.longitude,
            property.area_usable_m2,
            property.surface_type,
            panel.area_m2,
            panel.power_watt
        )
        const production = await getProduction({
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
        })

        const payload = {
            annual_generation_kwh: production.annual_generation_kwh,
            degradation_by_year: production.degradation_by_year,
            annual_consumption_kwh: annualConsumption,
            installed_power_kwp: systemDesign.installed_pwr_kwp,
            electricity_price_eur_kwh: parseFloat(property.electricity_price_eur_kwh) || 0.30,
            compensation_price_eur_kwh: parseFloat(property.compensation_price_eur_kwh) || 0.15,
            annual_maintenance_eur: parseFloat(property.annual_maintenance_eur) || 200,
            roof_type: property.roof_material === "complex" ? "complex" : "simple",
            has_battery: false,
            battery_kwh: 0,
            discount_rate: 0.05,
            horizon_years: 25
        }

        const result = await getFinancial(payload)
        return res.status(200).json(result)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { getFinancialController }