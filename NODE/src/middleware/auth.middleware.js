const admin = require("../config/firebase-admin");
const { getUserByFirebaseUid } = require("../models/user.model");

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await getUserByFirebaseUid(decodedToken.uid);

    if (!user) {
      return res.status(404).json({ error: "User not registered" });
    }

    req.user = {
      id: user.id,             
      uid: decodedToken.uid,    
      email: decodedToken.email,
      role: user.role || "user"
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

module.exports = { authMiddleware, verifyFirebaseToken };