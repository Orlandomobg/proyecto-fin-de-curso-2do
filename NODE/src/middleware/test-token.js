// test-token.js
const admin = require("../config/firebase-admin")
async function testToken() {
  try {
    // Genera token
    const token = await admin.auth().createCustomToken("test-user-456")
    console.log("Token generado:", token.substring(0, 50) + "...")

    // Inmediatamenteverifica el mismo token
    const decoded = await admin.auth().verifyIdToken(token)
    console.log("Token verificado. UID:", decoded.uid)
  } catch (error) {
    console.error("Error:", error.message)
  }
}

testToken()