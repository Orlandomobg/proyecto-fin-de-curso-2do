const {
  createProperty,
  getPropertiesByUserId,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../models/property.model");

const createPropertyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyData = req.body;

    if (!propertyData.address || !propertyData.latitude || !propertyData.longitude) {
      return res.status(400).json({ error: "address, latitude, longitude required" });
    }

    const property = await createProperty(userId, propertyData);
    return res.status(201).json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPropertiesController = async (req, res) => {
  try {
    const properties = await getPropertiesByUserId(req.user.id);
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPropertyController = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await getPropertyById(id);
    // 404 también si no es del usuario (no revelamos que existe)
    if (!property || property.user_id !== req.user.id) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePropertyController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getPropertyById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: "Property not found" });
    }

    const property = await updateProperty(id, req.body);
    return res.json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePropertyController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getPropertyById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: "Property not found" });
    }

    await deleteProperty(id);
    return res.json({ message: "Property deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPropertyController,
  getPropertiesController,
  getPropertyController,
  updatePropertyController,
  deletePropertyController
};