const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createPropertyController,
  getPropertiesController,
  getPropertyController,
  updatePropertyController,
  deletePropertyController
} = require("../controllers/property.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPropertyController);
router.get("/", getPropertiesController);
router.get("/:id", getPropertyController);
router.put("/:id", updatePropertyController);
router.delete("/:id", deletePropertyController);

module.exports = router;