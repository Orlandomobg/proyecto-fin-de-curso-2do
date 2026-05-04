const {getSolarResource,getSystemDesign} = require("../services/solarEngine.service")

const getSolarResourceController = async (req,res) => { 

    try {
        const {latitude,longitude} = req.body

        if (!latitude||!longitude) {
            return res.status(400).json({error: "latitude and logitude are required"})
        }

        const data = await getSolarResource(latitude,longitude)
        return res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const getSystemDesignController = async (req,res) =>{

    try {
        const {latitude,longitude,area_usable_m2,surface_type,panel_area_m2,panel_power_watt} = req.body

        const requiredFields = {
                        latitude,
                        longitude,
                        area_usable_m2,
                        surface_type,
                        panel_area_m2,
                        panel_power_watt
                        }
        
        const errors = Object.entries(requiredFields)
        .filter(([key, value]) => !value)
        .map(([key]) => `${key} is required`)

        if (errors.length > 0) {
        return res.status(400).json({ errors })
        }

        const data = await getSystemDesign(latitude,longitude,area_usable_m2,surface_type,panel_area_m2,panel_power_watt)
        res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {getSolarResourceController,getSystemDesignController}