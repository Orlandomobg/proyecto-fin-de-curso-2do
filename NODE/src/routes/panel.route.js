const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const rolesMiddleware = require("../middleware/roles.middleware");
const {
  createPanelController,
  getAllPanelsController,
  getPanelController,
  updatePanelController,
  deletePanelController
} = require("../controllers/panel.controller");

const router = express.Router();


router.get("/", getAllPanelsController);
router.get("/:id", getPanelController);

//admin
router.post(
  "/", 
  authMiddleware, 
  rolesMiddleware(["admin"]), 
  createPanelController
);

router.put(
  "/:id", 
  authMiddleware, 
  rolesMiddleware(["admin"]), 
  updatePanelController
);

router.delete(
  "/:id", 
  authMiddleware, 
  rolesMiddleware(["admin"]),  
  deletePanelController
);

module.exports = router;