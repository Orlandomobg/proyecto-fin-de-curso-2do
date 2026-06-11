require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const { authMiddleware } = require("./src/middleware/auth.middleware");
const admin = require("./src/config/firebase-admin");

// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
const userRoutes = require("./src/routes/user.route");
app.use("/api/users", userRoutes);

const propertyRoutes = require("./src/routes/property.route");
app.use("/api/properties", propertyRoutes);

const solarRoutes = require("./src/routes/solarEngine.route");
app.use("/api/solar", solarRoutes);

const productionRoutes = require("./src/routes/production.route");
app.use("/api/production", productionRoutes);

const financialRoutes = require("./src/routes/financial.route");
app.use("/api/financial", financialRoutes);

const panelRoutes = require("./src/routes/panel.route");
app.use("/api/panels", panelRoutes);

const energyRoutes = require("./src/routes/energy.route");
app.use("/api/energy-consumption", energyRoutes);

// auth test
app.get("/test-auth", authMiddleware, (req, res) => {
  res.json({ message: "Autenticated!", user: req.user });
});

// middleware de errores (antes del listen)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});