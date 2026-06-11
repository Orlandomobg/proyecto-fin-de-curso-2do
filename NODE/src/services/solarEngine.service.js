const FASTAPI = process.env.FASTAPI_URL || "http://localhost:8000"

const postJson = async (path, body) => {
    const response = await fetch(`${FASTAPI}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(`FASTAPI error: ${response.status}`)
    }
    return await response.json()
}

const getSolarResource = async (latitude, longitude) => {
    try {
        return await postJson("/solar_resource/", { latitude, longitude })
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

const getSystemDesign = async (latitude, longitude, area_usable_m2, surface_type, panel_area_m2, panel_power_watt) => {
    try {
        return await postJson("/system_design/", { latitude, longitude, area_usable_m2, surface_type, panel_area_m2, panel_power_watt })
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

const getProduction = async (payload) => {
    try {
        return await postJson("/production/", payload)
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

const getFinancial = async (payload) => {
    try {
        return await postJson("/financial/", payload)
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

// predicción ML en tiempo real (watts ahora mismo)
const getRealtimePrediction = async (lat, lon, slope, azimuth) => {
    try {
        return await postJson("/prediction/", { lat, lon, slope, azimuth })
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

module.exports = { getSolarResource, getSystemDesign, getProduction, getFinancial, getRealtimePrediction }