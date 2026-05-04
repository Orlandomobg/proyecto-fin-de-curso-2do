
// por verificar que todo este correcto, se necesita auth de front
const rolesMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    console.log("=== ROLES MIDDLEWARE ===");
    console.log("User role:", req.user?.role);
    console.log("Allowed roles:", allowedRoles);

    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log("User role not allowed");
      return res.status(403).json({ 
        error: "Forbidden - Insufficient permissions",
        required_role: allowedRoles,
        user_role: req.user.role
      });
    }

    console.log("✓ User role allowed");
    next();
  };
};

module.exports = rolesMiddleware;