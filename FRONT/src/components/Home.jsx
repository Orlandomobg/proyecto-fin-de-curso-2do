import React from 'react';
import { useNavigate } from 'react-router-dom';
import Info from './Info';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px' }}
        >
          El Futuro de la <span style={{ color: '#fbbf24' }}>Energía es Inteligente</span>
        </motion.h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 40px' }}>
          En SOLAR IA no solo calculamos paneles; diseñamos tu independencia energética usando
          datos satelitales de la NASA y algoritmos de predicción climática.
        </p>
        <button
          onClick={() => navigate("/calculadora")}
          style={{
            padding: '18px 40px', fontSize: '1.1rem', fontWeight: 'bold',
            backgroundColor: '#fbbf24', color: '#0f172a', border: 'none',
            borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(251, 191, 36, 0.3)'
          }}
        >
          PROBAR CALCULADORA GRATIS
        </button>
      </section>

      {/* ABOUT US SECTION */}
      <section style={{ maxWidth: '1000px', margin: '80px auto', padding: '40px', backgroundColor: '#1e293b', borderRadius: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#fbbf24', fontSize: '2rem', marginBottom: '20px' }}>¿Por qué Solaris?</h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
              Somos un equipo de ingenieros y desarrolladores cansados de la falta de transparencia en el sector solar.
              Creamos una herramienta <strong>independiente</strong> que no intenta venderte paneles, sino darte la verdad técnica.
              <br /><br />
              Nuestra IA analiza tu ubicación exacta, las sombras proyectadas y el historial climático para darte un ROI (Retorno de Inversión) con precisión del 95%.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem' }}>🤖</div>
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Ingeniería + IA</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
