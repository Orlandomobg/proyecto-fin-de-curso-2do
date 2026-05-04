const {
  createEnergyConsumption,
  getEnergyByUserId,
  getEnergyByPropertyId,
  getAnnualEnergyByPropertyId,
  getEnergyById,
  updateEnergyConsumption,
  deleteEnergyConsumption
} = require("../models/energy.model");

const createEnergyController = async (req, res) => {
  try {
    const userId = req.user.uid;
    const energyData = req.body;

    if (!energyData.property_id || !energyData.annual_kwh) {
      return res.status(400).json({ 
        error: "property_id and annual_kwh required" 
      });
    }

    const energy = await createEnergyConsumption(userId, energyData);
    return res.status(201).json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnergyController = async (req, res) => {
  try {
    const userId = req.user.uid;

    const energy = await getEnergyByUserId(userId);
    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnergyByPropertyController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const energy = await getEnergyByPropertyId(propertyId);
    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAnnualEnergyController = async (req, res) => {
  try {
    const { propertyId } = req.params;

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
    if (!energy) {
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

    const energy = await updateEnergyConsumption(id, req.body);
    if (!energy) {
      return res.status(404).json({ error: "Energy consumption not found" });
    }

    return res.json(energy);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteEnergyController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteEnergyConsumption(id);
    if (!deleted) {
      return res.status(404).json({ error: "Energy consumption not found" });
    }

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