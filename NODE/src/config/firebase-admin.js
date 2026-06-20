const admin = require("firebase-admin");

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "Faltan credenciales de Firebase en el .env (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)"
  );
}

const formattedPrivateKey = FIREBASE_PRIVATE_KEY
  .replace(/^"|"$/g, "")
  .replace(/^'|'$/g, "")
  .replace(/\\n/g, "\n")
  .trim();

admin.initializeApp({
  credential: admin.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: formattedPrivateKey,
  }),
});

module.exports = admin;