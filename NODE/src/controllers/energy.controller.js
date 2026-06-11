const {
  createEnergyConsumption,
  getEnergyByUserId,
  getEnergyByPropertyId,
  getAnnualEnergyByPropertyId,
  getEnergyById,
  updateEnergyConsumption,
  deleteEnergyConsumption
} = require("../models/energy.model");
const { getPropertyById } = require("../models/property.model");

// comprueba que la propiedad pertenece al usuario
const ownsProperty = async (propertyId, userId) => {
  const property = await getPropertyById(propertyId);
  return Boolean(property) && property.user_id === userId;
};

const createEnergyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const energyData = req.body;

    if (!energyData.property_id || !energyData.annual_kwh) {
      return res.status(400).json({ error: "property_id and annual_kwh required" });
    }

    // no se puede crear un consumo sobre una propiedad que no es tuya
    if (!(await ownsProperty(energyData.property_id, userId))) {
      return res.status(404).json({ error: "Property not found" });
    }

    const energy = await createEnergyConsumption(userId, energyData);
    return res.status(201).json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnergyController = async (req, res) => {
  try {
    const energy = await getEnergyByUserId(req.user.id);
    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnergyByPropertyController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!(await ownsProperty(propertyId, req.user.id))) {
      return res.status(404).json({ error: "Property not found" });
    }

    const energy = await getEnergyByPropertyId(propertyId);
    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAnnualEnergyController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!(await ownsProperty(propertyId, req.user.id))) {
      return res.status(404).json({ error: "Property not found" });
    }

    const annual_kwh = await getAnnualEnergyByPropertyId(propertyId);
    return res.json({ property_id: propertyId, annual_kwh });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnergyByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const energy = await getEnergyById(id);
    if (!energy || energy.user_id !== req.user.id) {
      return res.status(404).json({ error: "Energy consumption not found" });
    }

    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateEnergyController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getEnergyById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: "Energy consumption not found" });
    }

    const energy = await updateEnergyConsumption(id, req.body);
    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteEnergyController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getEnergyById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: "Energy consumption not found" });
    }

    await deleteEnergyConsumption(id);
    return res.json({ message: "Energy consumption deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEnergyController,
  getEnergyController,
  getEnergyByPropertyController,
  getAnnualEnergyController,
  getEnergyByIdController,
  updateEnergyController,
  deleteEnergyController
};