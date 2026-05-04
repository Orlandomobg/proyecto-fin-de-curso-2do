const API = "http://localhost:4000";

// ─── 1. Carga paneles desde la DB (vía Node /api/panels) ──────────────────────
export const fetchPanels = async () => {
  const response = await fetch(`${API}/api/panels`);
  if (!response.ok) throw new Error(`Error cargando paneles: ${response.status}`);
  return response.json();
  // Devuelve array con todos los campos de la tabla: brand, model, power_watt,
  // efficiency_percentage, area_m2, cost_per_watt_eur, etc.
};

// ─── 2. System Design ─────────────────────────────────────────────────────────
export const fetchSystemDesign = async ({ latitude, longitude, superficie, surface_type, panel }) => {
  const response = await fetch(`${API}/api/solar/get-system-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      latitude,
      longitude,
      area_usable_m2: superficie,
      surface_type,
      panel_area_m2: panel.area_m2,
      panel_power_watt: panel.power_watt,
    }),
  });
  if (!response.ok) throw new Error(`System design error: ${response.status}`);
  return response.json();
};

// ─── 3. Financial ─────────────────────────────────────────────────────────────
export const fetchFinancial = async ({ property_id, panel_id }) => {
  const response = await fetch(`${API}/api/financial/get-financial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property_id, panel_id }),
  });
  if (!response.ok) throw new Error(`Financial error: ${response.status}`);
  return response.json();
};

// ─── 4. Simulación completa ───────────────────────────────────────────────────
export const processSimulation = async ({
  prioridad,
  gasto,
  superficie,
  orientacion,
  latitude,
  longitude,
  surface_type,
  property_id,
  panel_id,
}) => {

  // 1. Carga paneles reales desde DB
  const panels = await fetchPanels();

  // 2. Sort por prioridad (lógica ligera, ok en front)
  const sorted = [...panels];
  if (prioridad === "economico") {
    sorted.sort((a, b) => a.cost_per_watt_eur - b.cost_per_watt_eur);
  } else if (prioridad === "potencia") {
    sorted.sort((a, b) => b.power_watt - a.power_watt);
  } else if (prioridad === "garantia") {
    sorted.sort((a, b) => b.lifespan_years - a.lifespan_years);
  } else {
    // default: eficiencia
    sorted.sort((a, b) => b.efficiency_percentage - a.efficiency_percentage);
  }
  const bestPanel = sorted[0];

  // 3. System design real (PVGIS)
  const systemDesign = await fetchSystemDesign({
    latitude, longitude, superficie, surface_type,
    panel: bestPanel,
  });

  // 4. Financial completo
  const financial = await fetchFinancial({ property_id, panel_id });

  return {
    panel: bestPanel,
    allPanels: panels,       // útil si el front quiere mostrar comparativa
    systemDesign,
    financial,
    originalExpense: gasto,
    orientacion,
  };
};