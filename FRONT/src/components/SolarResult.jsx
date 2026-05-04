import React from 'react';
import {
  Zap, Maximize, ThermometerSun, Snowflake, CloudSun,
  Sun, Award, MapPin, RefreshCcw,
  Euro, ExternalLink, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SolarResult = ({ data, reset }) => {
  if (!data) return null;

  const unitCost = data.costoPanelUnitario || 0;
  const totalEquipmentCost = (data.cantidad * unitCost).toLocaleString('es-ES');

  // Config for the 3 season rows (merging spring/autumn)
  const seasonsConfig = [
    {
      id: 'winter',
      label: 'Invierno',
      icon: Snowflake,
      color: "#60a5fa",
      gradient: "linear-gradient(90deg, #1d4ed8, #60a5fa)",
      value: data.comparativa?.invierno || { ahorro: 0, kwh: 0 }
    },
    {
      id: 'spring_autumn',
      label: 'Primavera / Otoño',
      icon: CloudSun,
      color: "#4ade80",
      gradient: "linear-gradient(90deg, #15803d, #4ade80)",
      value: data.comparativa?.primavera || data.comparativa?.otono || { ahorro: 0, kwh: 0 }
    },
    {
      id: 'summer',
      label: 'Verano',
      icon: Sun,
      color: "#fbbf24",
      gradient: "linear-gradient(90deg, #b45309, #fbbf24)",
      value: data.comparativa?.verano || { ahorro: 0, kwh: 0 }
    }
  ];

  return (
    <div style={{ animation: 'slideUp 0.5s ease', width: '100%' }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '30px', borderRadius: '24px', color: 'white' }}>

        {/* TITLE & CONFIGURATION */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Award size={40} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {data.panelNombre}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '8px' }}>
            Configuración: <span style={{ color: 'white', fontWeight: '700' }}>{data.cantidad} paneles</span>
          </p>
        </div>

        {/* TOP STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '2px solid #fbbf24' }}>
            <Euro size={20} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{totalEquipmentCost} €</div>
            <div style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Equipo Base</div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
            <Zap size={20} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{data.potenciaTotalW} W</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Potencia Total</div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
            <Maximize size={20} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{data.areaOcupada} m²</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Superficie</div>
          </div>
        </div>

        {/* MAIN ACTION BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '35px' }}>
          <a href={data.link_compra} target="_blank" rel="noopener noreferrer" style={{
            textDecoration: 'none', background: '#fbbf24', color: '#0f172a', padding: '16px',
            borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px'
          }}>
            <ExternalLink size={20} /> COMPRAR PANEL
          </a>
          <a href={data.ficha_tecnica} target="_blank" rel="noopener noreferrer" style={{
            textDecoration: 'none', background: '#334155', color: 'white', padding: '16px',
            borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px'
          }}>
            <FileText size={20} /> FICHA TÉCNICA
          </a>
        </div>

        {/* AI SAVINGS PROJECTION WITH BARS */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '25px' }}>
          <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThermometerSun size={20} color="#fbbf24" /> Proyección de Ahorro IA
          </h4>

          {seasonsConfig.map((season) => (
            <div key={season.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <season.icon size={18} color={season.color} />
                  <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{season.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginRight: '10px' }}>{season.value.kwh} kWh</span>
                  <span style={{ color: season.color, fontWeight: '800', fontSize: '1.2rem' }}>+{season.value.ahorro}€/mes</span>
                </div>
              </div>
              {/* PROGRESS BAR */}
              <div style={{ background: '#0f172a', height: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div style={{
                  width: `${Math.min((season.value.ahorro / (data.gastoOriginal || 100)) * 100, 100)}%`,
                  height: '100%',
                  background: season.gradient,
                  borderRadius: '10px',
                  transition: 'width 1s ease-in-out'
                }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* FINAL ACTIONS */}
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/instaladores" style={{ textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '16px', background: '#fbbf24', color: '#1e293b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem' }}>
              <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> VER INSTALADORES CERCA
            </button>
          </Link>
          <button onClick={reset} style={{ width: '100%', padding: '15px', background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            NUEVO ANÁLISIS
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolarResult;
