const FASTAPI = process.env.FASTAPI_URL || "http://localhost:8000"

const getSolarResource = async (latitude,longitude) => {
    try {
        const response = await fetch(`${FASTAPI}/solar_resource`,{
            method : "POST",
            headers : {
                "content-type": 'application/json'
            },
            body : JSON.stringify({latitude,longitude})
    })
        if (!response.ok) {
            throw new Error(`FASTAPI error: ${response.status}`)
        } else
            return await response.json()

    } catch (error) {
        throw new Error(`error: ${error.message}`)

    }
}

const getSystemDesign = async (latitude,longitude,area_usable_m2,surface_type,panel_area_m2,panel_power_watt) =>{
    try {
        const response = await fetch(`${FASTAPI}/system_design`,{
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({latitude,longitude,area_usable_m2,surface_type,panel_area_m2,panel_power_watt})
        
        })
        if (!response.ok){
            throw new Error(`FASTAPI error: ${response.status}`)
        }else{
            return await response.json()
        }
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }

}

const getProduction = async (payload) => {
    try {
        const response = await fetch(`${FASTAPI}/production/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(payload)
        })
        if (!response.ok) {
            throw new Error(`FASTAPI error: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        throw new Error(`error: ${error.message}`)
    }
}

const getFinancial = async(payload) => {
    try {
        const response = await fetch(`${FASTAPI}/financial/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        if (!response.ok) {
            throw new Error(`FASTAPI error: ${response.status}`)
        }
        return await response.json()
        throw new Error(`error: ${error.message}`)
    } catch (error) {
        
    }
} 


module.exports = {getSolarResource,getSystemDesign,getProduction,getFinancial}
