import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstallerList = () => {
  const navigate = useNavigate();

  const companies = [
    { nombre: "Madrid Solar kWp", url: "https://www.madridsolarkwp.com/" },
    { nombre: "HOY SOLAR", url: "https://instaladorpanelsolar.com/" },
    { nombre: "SOLARO Energía", url: "https://solaro.es/" },
    { nombre: "Xolary Solar", url: "https://xolary.com/?utm_source=gmb&utm_medium=organic&utm_campaign=google-my-business" },
    { nombre: "Atrenti (Solarinstala)", url: "https://atrenti.com/" }
  ];

  return (
    <div className="main-content" style={{ paddingTop: '110px', paddingBottom: '50px', display: 'flex', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '700px', padding: '40px',
          background: '#1e293b', borderRadius: '24px', border: '1px solid #334155'
        }}
      >
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft size={18} /> Volver a mi cálculo
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <MapPin size={40} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800' }}>Instaladores en Madrid</h2>
          <p style={{ color: '#94a3b8' }}>Empresas certificadas para ejecutar tu proyecto solar</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {companies.map((company, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#0f172a', borderRadius: '15px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={20} color="#fbbf24" />
                <span style={{ color: 'white', fontWeight: '600' }}>{company.nombre}</span>
              </div>
              <a href={company.url} target="_blank" rel="noreferrer" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Web <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InstallerList;
