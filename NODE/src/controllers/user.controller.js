const {createUser, getUserByFirebaseUid, getUserById, updateUser, deleteUser, getAllUsers} = require("../models/user.model");


const createUserController = async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    const { name } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Invalid Firebase token payload" });
    }

    const existing = await getUserByFirebaseUid(uid);
    if (existing) {
      return res.status(409).json({ error: "User already registered" });
    }

    const user = await createUser(uid, email, name);
    return res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getProfileController = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name, email } = req.body;

    const user = await updateUser(firebaseUid, name, email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProfileController = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    await deleteUser(firebaseUid);
    return res.json({ message: "User deleted successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// admin
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// admin
const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {createUserController, getProfileController, updateProfileController, deleteProfileController, getAllUsersController, getUserByIdController};