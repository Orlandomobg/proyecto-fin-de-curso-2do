import "../../src/css/App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Components
import MainPage from "./MainPage";
import Home from "./Home";
import Info from "./Info";
import Form from "./Form";
import SolarResult from "./SolarResult";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import InstallerList from "./InstallerList";
import Catalog from "./Catalog";

// Engineering logic
import { processSimulation } from "../utils/engine";

function App() {
  const [coords, setCoords] = useState({ lat: 40.4167, lon: -3.7033 });
  const [aiResult, setAiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // GPS
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords({ lat: position.coords.latitude, lon: position.coords.longitude }),
        (error) => console.warn("GPS denied, using Madrid as default."),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // MAIN CONNECTION FUNCTION
  const handleFinalData = async (formData) => {
  setIsLoading(true);
  try {
    const engineeringResult = await processSimulation({
      ...formData,
      latitude: coords.lat,
      longitude: coords.lon,
    });

    console.log("engineeringResult:", engineeringResult); // ← verifica que llega bien

    setAiResult(engineeringResult); // temporal hasta reconectar el SolarResult

  } catch (error) {
    console.error("Detailed error:", error.response?.data || error.message);
    alert("Error en el servidor de IA. Revisa la consola.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', color: 'white' }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Nav/Header component is usually inside MainPage */}
      <MainPage />

      <Routes>
        {/* HOME ROUTE */}
        <Route path="/" element={
          <div style={{ paddingTop: '100px' }}>
            <Home />
            <Info />
          </div>
        } />

        {/* CALCULATOR ROUTE */}
        <Route path="/calculadora" element={
          <div className="main-content" style={{ paddingTop: '110px', paddingBottom: '50px' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: '20px', color: '#fbbf24' }}>Consultando Clima e IA de Producción...</p>
                </div>
              ) : !aiResult ? (
                <div style={{ animation: 'fadeIn 0.8s' }}>
                  <h2 style={{ textAlign: 'center', color: '#fbbf24', marginBottom: '30px', fontWeight: '800' }}>
                    SIMULADOR SOLAR IA
                  </h2>
                  <Form onDataReceived={handleFinalData} />
                </div>
              ) : (
                <div style={{ animation: 'slideUp 0.6s' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button
                      onClick={() => setAiResult(null)}
                      style={{ background: 'none', border: '1px solid #fbbf24', color: '#fbbf24', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      ↺ Nuevo cálculo
                    </button>
                  </div>
                  <SolarResult data={aiResult} reset={() => setAiResult(null)} />
                </div>
              )}
            </div>
          </div>
        } />

        {/* CATALOG ROUTE (NEW) */}
        <Route path="/catalogo" element={
          <div style={{ paddingTop: '110px', paddingBottom: '50px' }}>
            <Catalog />
          </div>
        } />

        {/* OTHER ROUTES */}
        <Route path="/perfil" element={
          <div className="main-content" style={{ paddingTop: '110px', paddingBottom: '50px' }}>
            <Profile />
          </div>
        } />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/instaladores" element={<InstallerList />} />
      </Routes>
    </div>
  );
}

export default App;
