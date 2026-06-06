# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solar panel installation calculator and management system. Users input roof area, budget, and location; the app fetches real climate data, runs system design calculations, and recommends panels with financial projections.

## Services and How to Run Them

Four independent services — run all simultaneously for full functionality.

### Frontend (FRONT/) — React + Vite, port 5173
```
cd FRONT && npm run dev
```
Build for production: `npm run build`

### Backend (NODE/) — Express.js, port 4000
```
cd NODE && npm run dev
```
Requires `.env` with `DB_*` (PostgreSQL), `FIREBASE_*`, and `FASTAPI_URL`.

### Python API (FASTAPI/) — FastAPI + Uvicorn, port 8000
```
cd FASTAPI && uvicorn app.main:app --reload
```
Requires `.env` based on `FASTAPI/.env.example`. Calls external APIs (NASA POWER, Open-Meteo, PVGIS).

### ML Service (ML/) — FastAPI wrapper around scikit-learn model, port 8001
```
cd ML && uvicorn main:app --reload --port 8001
```
Uses pre-trained `modelo_solar.pkl`. Retrain with `python modelo.py`.

## Architecture and Data Flow

```
React (FRONT)
  └─ App.jsx processSimulation()
       ├─ GET /api/panels          → Node → PostgreSQL (panel catalog)
       ├─ POST /api/solar          → Node → FastAPI /system_design
       │                                   └─ PVGIS API (optimal tilt/azimuth)
       ├─ FastAPI /solar_resource  → NASA POWER + Open-Meteo APIs
       └─ FastAPI /production      → ML Service (RandomForest prediction)
```

**Core simulation flow** (`FRONT/src/utils/engine.js`):
1. User submits form (budget, roof area, priority: cost/efficiency/warranty)
2. `processSimulation()` fetches panel catalog from Node, sorts by user priority
3. Calls FastAPI `system_design` with coordinates and roof area → returns optimal panel count, tilt, azimuth
4. Combines results and routes to `SolarResult` component

**Node.js backend** (`NODE/src/`) handles: user auth (Firebase UID), panel catalog (PostgreSQL), energy consumption records, and proxies calculation requests to FastAPI.

**FastAPI** (`FASTAPI/app/routers/`) aggregates external climate APIs and runs system design math. Completely stateless.

**ML model** (`ML/`) predicts power output (Watts) from irradiation (G_total), temperature (T2m), and wind speed (WS10m) via a pre-trained RandomForestRegressor.

## Key Configuration

Copy `.env.example` files before first run:
- `NODE/.env.example` → `NODE/.env` (PostgreSQL credentials, Firebase service account path, FastAPI URL)
- `FASTAPI/.env.example` → `FASTAPI/.env` (external API base URLs)

Firebase service account JSON goes in `NODE/src/config/firebase-key.json`.

PostgreSQL database name: `solar_project`. Schema is initialized via the model files in `NODE/src/models/`.

Default coordinates fallback (no GPS): Madrid — `lat: 40.4167, lon: -3.7033`.

## Key Files

| File | Purpose |
|------|---------|
| `FRONT/src/components/App.jsx` | Main routing, simulation state, `processSimulation()` |
| `FRONT/src/utils/engine.js` | Orchestrates all API calls for a simulation run |
| `FRONT/src/data/panels.js` | Local panel catalog data |
| `NODE/src/services/solarEngine.service.js` | Core calculation logic on Node side |
| `NODE/src/config/db.js` | PostgreSQL pool setup |
| `FASTAPI/app/routers/` | system_design, solar_resource, production, financial endpoints |
| `ML/modelo.py` | Model training script |
| `ML/main.py` | FastAPI wrapper exposing the trained model |
