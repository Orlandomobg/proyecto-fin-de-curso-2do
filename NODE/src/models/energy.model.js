const pool = require("../config/db");

const createEnergyConsumption = async (userId, energyData) => {
  const {
    property_id,
    annual_kwh,
    month,
    year,
    consumption_kwh,
    energy_source
  } = energyData;

  try {
    const { rows } = await pool.query(
      `INSERT INTO energy_consumptions (
        user_id, property_id, annual_kwh, month, year, consumption_kwh, energy_source, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        userId, property_id, annual_kwh, month, year, consumption_kwh, energy_source
      ]
    );
    return rows[0];
    
  } catch (error) {
    throw error;
  }
};

const getEnergyByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM energy_consumptions 
       WHERE user_id = $1
       ORDER BY year DESC, month DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getEnergyByPropertyId = async (propertyId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM energy_consumptions 
       WHERE property_id = $1
       ORDER BY year DESC, month DESC`,
      [propertyId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAnnualEnergyByPropertyId = async (propertyId) => {
  try {
    const { rows } = await pool.query(
      `SELECT annual_kwh FROM energy_consumptions 
       WHERE property_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [propertyId]
    );
    return rows[0]?.annual_kwh || 0;
  } catch (error) {
    throw error;
  }
};

const getEnergyById = async (id) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM energy_consumptions WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const updateEnergyConsumption = async (id, energyData) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  Object.entries(energyData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (updates.length === 0) {
    return await getEnergyById(id);
  }

  values.push(id);
  const updateString = updates.join(", ");

  try {
    const { rows } = await pool.query(
      `UPDATE energy_consumptions 
       SET ${updateString}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const deleteEnergyConsumption = async (id) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM energy_consumptions WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] ? true : false;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEnergyConsumption,
  getEnergyByUserId,
  getEnergyByPropertyId,
  getAnnualEnergyByPropertyId,
  getEnergyById,
  updateEnergyConsumption,
  deleteEnergyConsumption
};