const express = require("express");
const { authMiddleware, verifyFirebaseToken } = require("../middleware/auth.middleware");
const rolesMiddleware = require("../middleware/roles.middleware");
const {
  createUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  getAllUsersController,
  getUserByIdController
} = require("../controllers/user.controller");

const router = express.Router();

// registro valida el token de Firebase, no postgre
router.post("/", verifyFirebaseToken, createUserController);

router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);
router.delete("/profile", authMiddleware, deleteProfileController);

// admin
router.get("/", authMiddleware, rolesMiddleware(["admin"]), getAllUsersController);
router.get("/:id", authMiddleware, rolesMiddleware(["admin"]), getUserByIdController);

module.exports = router;