const express = require("express");
const { getProductionController } = require("../controllers/production.controller")
const router = express.Router();

router.post("/get-production", getProductionController)

module.exports = router