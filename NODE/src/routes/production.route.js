const express = require("express");
const { getProductionController } = require("../controllers/production.controller")

const router = express.Router();

router.post("/", getProductionController)

module.exports = router