const {
  createProperty,
  getPropertiesByUserId,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../models/property.model");

const createPropertyController = async (req, res) => {
  try {
    const userId = req.user.uid; // middleware 
    const propertyData = req.body;

    if (!propertyData.address || !propertyData.latitude || !propertyData.longitude) {
      return res.status(400).json({ 
        error: "address, latitude, longitude required" 
      });
    }

    const property = await createProperty(userId, propertyData);
    return res.status(201).json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getPropertiesController = async (req, res) => {
  try {
    const userId = req.user.uid;

    const properties = await getPropertiesByUserId(userId);
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getPropertyController = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await getPropertyById(id);
    if (!property) {
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

    const property = await updateProperty(id, req.body);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePropertyController = async (req, res) => {
  try {
    const { id } = req.params;

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