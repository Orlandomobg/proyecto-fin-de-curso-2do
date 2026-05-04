const admin = require("../config/firebase-admin");
const { getUserByFirebaseUid } = require("../models/user.model");

// nota: todavia console log en mayoria de porcesos porque todavia esta por verificar
const authMiddleware = async (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE ===");
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("Verifying token with Firebase...");
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token valid. UID:", decodedToken.uid);


    const user = await getUserByFirebaseUid(decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: user?.role || "user"
    };

    console.log("User role:", req.user.role);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ 
      error: "Invalid token",
      details: error.message
    });
  }
};

module.exports = authMiddleware;