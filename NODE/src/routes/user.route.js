const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  getAllUsersController,
  getUserByIdController
} = require("../controllers/user.controller");

const router = express.Router();


router.post("/", createUserController);
router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);
router.delete("/profile", authMiddleware, deleteProfileController);

// admin
router.get("/", authMiddleware, getAllUsersController);
router.get("/:id", authMiddleware, getUserByIdController);

module.exports = router;