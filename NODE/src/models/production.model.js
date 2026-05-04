const pool = require ("../config/db")

const getPanelData = async () => {
    const {rows} = await pool.query("SELECT * FROM solar_panels")
    return rows; 
}

const getPanelDataId = async (id) => {
    const {rows}= await pool.query("SELECT * FROM Solar_panels WHERE id = $1",[id])
    return rows[0];
}

const getPropertiesId = async (id) => { 
    const {rows} = await pool.query("SELECT * FROM properties WHERE id = $1",[id])
    return rows[0];
} 

module.exports = {getPanelData,getPanelDataId,getPropertiesId}