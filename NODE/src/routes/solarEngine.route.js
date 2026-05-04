const express = require("express");
const {getSolarResourceController,getSystemDesignController} = require("../controllers/solarEngine.controller")

const router = express.Router();

router.post("/get-solar-resource",getSolarResourceController)
router.post("/get-system-design",getSystemDesignController)

module.exports = router