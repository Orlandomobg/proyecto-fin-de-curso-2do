const pool = require("../config/db");

const createProperty = async (userId, propertyData) => {
  const {
    address,
    latitude,
    longitude,
    area_total_m2,
    area_usable_m2,
    surface_type,
    orientation_degree,
    tilt_angle_degree,
    shading_factor,
    roof_material,
    electricity_price_eur_kwh,
    compensation_price_eur_kwh,
    annual_maintenance_eur
  } = propertyData;

  try {
    const { rows } = await pool.query(
      `INSERT INTO properties (
        user_id, address, latitude, longitude, area_total_m2, area_usable_m2,
        surface_type, orientation_degree, tilt_angle_degree, shading_factor,
        roof_material, electricity_price_eur_kwh, compensation_price_eur_kwh,
        annual_maintenance_eur, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING *`,
      [
        userId, address, latitude, longitude, area_total_m2, area_usable_m2,
        surface_type, orientation_degree, tilt_angle_degree, shading_factor,
        roof_material, electricity_price_eur_kwh, compensation_price_eur_kwh,
        annual_maintenance_eur
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getPropertiesByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM properties 
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getPropertyById = async (propertyId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM properties 
       WHERE id = $1 AND deleted_at IS NULL`,
      [propertyId]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const updateProperty = async (propertyId, propertyData) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  Object.entries(propertyData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (updates.length === 0) {
    return await getPropertyById(propertyId);
  }

  values.push(propertyId);
  const updateString = updates.join(", ");

  try {
    const { rows } = await pool.query(
      `UPDATE properties 
       SET ${updateString}, updated_at = NOW()
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const deleteProperty = async (propertyId) => {
  try {
    await pool.query(
      `UPDATE properties SET deleted_at = NOW() WHERE id = $1`,
      [propertyId]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProperty,
  getPropertiesByUserId,
  getPropertyById,
  updateProperty,
  deleteProperty
};