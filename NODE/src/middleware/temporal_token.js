// temporal-token.js
//const admin = require("./src/config/firebase-admin")
const admin = require("../config/firebase-admin")

async function generateToken() {
  try {
    const token = await admin.auth().createCustomToken("test-user-456")
    console.log("Token (válido por 1 hora):")
    console.log(token)
    console.log("\nCópialo inmediatamente y úsalo en Postman")
  } catch (error) {
    console.error("Error:", error.message)
  }
}

generateToken()