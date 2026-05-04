const express = require("express")
const {getFinancialController} = require("../controllers/financial.controller")

const router = express.Router()

router.post("/get-financial",getFinancialController)

module.exports = router