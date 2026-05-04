const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const rolesMiddleware = require("../middleware/roles.middleware");
const {
  createEnergyController,
  getEnergyController,
  getEnergyByPropertyController,
  getAnnualEnergyController,
  getEnergyByIdController,
  updateEnergyController,
  deleteEnergyController
} = require("../controllers/energy.controller");

const router = express.Router();


router.use(authMiddleware);

// user
router.post("/", createEnergyController);
router.get("/", getEnergyController);
router.get("/property/:propertyId", getEnergyByPropertyController);
router.get("/property/:propertyId/annual", getAnnualEnergyController);
router.get("/:id", getEnergyByIdController);
router.put("/:id", updateEnergyController);
router.delete("/:id", deleteEnergyController);


module.exports = router;