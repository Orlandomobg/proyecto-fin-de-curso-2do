const pool = require("../config/db");

const createPanel = async (panelData) => {
  const {
    brand,
    model,
    power_watt,
    efficiency_percentage,
    area_m2,
    price_unit,
    degradation_rate_year,
    lifespan_years,
    noct_celsius,
    temp_coefficient
  } = panelData;

  try {
    const { rows } = await pool.query(
      `INSERT INTO solar_panels (
        brand, model, power_watt, efficiency_percentage, area_m2, price_unit,
        degradation_rate_year, lifespan_years, noct_celsius, temp_coefficient, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [
        brand, model, power_watt, efficiency_percentage, area_m2, price_unit,
        degradation_rate_year, lifespan_years, noct_celsius, temp_coefficient
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllPanels = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM solar_panels ORDER BY created_at DESC`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getPanelById = async (id) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM solar_panels WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const updatePanel = async (id, panelData) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  Object.entries(panelData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (updates.length === 0) {
    return await getPanelById(id);
  }

  values.push(id);
  const updateString = updates.join(", ");

  try {
    const { rows } = await pool.query(
      `UPDATE solar_panels 
       SET ${updateString}, created_at = created_at
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const deletePanel = async (id) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM solar_panels WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] ? true : false;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPanel,
  getAllPanels,
  getPanelById,
  updatePanel,
  deletePanel
};