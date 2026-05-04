const {
  createPanel,
  getAllPanels,
  getPanelById,
  updatePanel,
  deletePanel
} = require("../models/panel.model");

//admin
const createPanelController = async (req, res) => {
  try {
    const panelData = req.body;

    if (!panelData.brand || !panelData.model || !panelData.power_watt) {
      return res.status(400).json({ 
        error: "brand, model, power_watt required" 
      });
    }

    const panel = await createPanel(panelData);
    return res.status(201).json(panel);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getAllPanelsController = async (req, res) => {
  try {
    const panels = await getAllPanels();
    return res.json(panels);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPanelController = async (req, res) => {
  try {
    const { id } = req.params;

    const panel = await getPanelById(id);
    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    return res.json(panel);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// admin
const updatePanelController = async (req, res) => {
  try {
    const { id } = req.params;

    const panel = await updatePanel(id, req.body);
    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    return res.json(panel);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// admin
const deletePanelController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deletePanel(id);
    if (!deleted) {
      return res.status(404).json({ error: "Panel not found" });
    }

    return res.json({ message: "Panel deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPanelController,
  getAllPanelsController,
  getPanelController,
  updatePanelController,
  deletePanelController
};