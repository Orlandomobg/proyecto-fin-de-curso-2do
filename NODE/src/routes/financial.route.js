const express = require("express")
const { getFinancialController } = require("../controllers/financial.controller")

const router = express.Router()

router.post("/", getFinancialController)

module.exports = router