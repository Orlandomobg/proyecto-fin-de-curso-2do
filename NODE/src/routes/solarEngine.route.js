const express = require("express");
const {
    getSolarResourceController,
    getSystemDesignController,
    getRealtimePredictionController
} = require("../controllers/solarEngine.controller")

const router = express.Router();

router.post("/resource", getSolarResourceController)
router.post("/system-design", getSystemDesignController)
router.post("/realtime", getRealtimePredictionController)

module.exports = router