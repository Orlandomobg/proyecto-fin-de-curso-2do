const pool = require("../config/db");


const createUser = async (firebaseUid, email, name) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (firebase_uid, email, name, role, created_at)
       VALUES ($1, $2, $3, 'user', NOW())
       RETURNING id, firebase_uid, email, name, role, created_at`,
      [firebaseUid, email, name || ""]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getUserByFirebaseUid = async (firebaseUid) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, firebase_uid, email, name, role, created_at
       FROM users
       WHERE firebase_uid = $1 AND deleted_at IS NULL`,
      [firebaseUid]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};


const getUserById = async (id) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, firebase_uid, email, name, role, created_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};


const updateUser = async (firebaseUid, name, email) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           updated_at = NOW()
       WHERE firebase_uid = $3 AND deleted_at IS NULL
       RETURNING id, firebase_uid, email, name, role, updated_at`,
      [name || null, email || null, firebaseUid]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};


const deleteUser = async (firebaseUid) => {
  try {
    await pool.query(
      `UPDATE users SET deleted_at = NOW() WHERE firebase_uid = $1`,
      [firebaseUid]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

// admin
const getAllUsers = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT id, firebase_uid, email, name, role, created_at
       FROM users
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByFirebaseUid,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers
};