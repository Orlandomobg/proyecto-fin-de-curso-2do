import React, { useState } from 'react';
import { Zap, ShieldCheck, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { panels } from '../data/panels'; // Make sure the path is correct

const Catalog = () => {
  const [priceFilter, setPriceFilter] = useState('all');
  const [wattsFilter, setWattsFilter] = useState('all');

  // Filtering logic
  const filteredPanels = panels.filter(panel => {
    const matchesPrice =
      priceFilter === 'all' ? true :
      priceFilter === 'low' ? panel.costo_panel_eur < 100 :
      priceFilter === 'mid' ? (panel.costo_panel_eur >= 100 && panel.costo_panel_eur <= 150) :
      panel.costo_panel_eur > 150;

    const matchesWatts =
      wattsFilter === 'all' ? true :
      wattsFilter === '400' ? (panel.watts >= 400 && panel.watts < 500) :
      wattsFilter === '500' ? panel.watts >= 500 : true;

    return matchesPrice && matchesWatts;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
          CATÁLOGO SOLAR 2026
        </h2>
        <p style={{ color: '#94a3b8' }}>Explora y filtra la mejor tecnología fotovoltaica del mercado.</p>
      </header>

      {/* FILTER BAR */}
      <div style={{
        background: '#1e293b',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24' }}>
          <SlidersHorizontal size={20} />
          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>FILTRAR POR:</span>
        </div>

        {/* Price Filter */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', padding: '10px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">Todos los precios</option>
          <option value="low">Económicos (Menos de 100€)</option>
          <option value="mid">Gama Media (100€ - 150€)</option>
          <option value="high">Premium (Más de 150€)</option>
        </select>

        {/* Watts Filter */}
        <select
          value={wattsFilter}
          onChange={(e) => setWattsFilter(e.target.value)}
          style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', padding: '10px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">Todas las potencias</option>
          <option value="400">400W - 499W</option>
          <option value="500">500W o más</option>
        </select>

        <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.9rem' }}>
          Mostrando {filteredPanels.length} paneles
        </div>
      </div>

      {/* RESULTS GRID */}
      {filteredPanels.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredPanels.map((panel) => (
            <div key={panel.id} style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '20px',
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(251,191,36,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  {panel.marca}
                </span>
                <h3 style={{ color: 'white', fontSize: '1.25rem', marginTop: '10px' }}>{panel.nombre}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap size={14} color="#fbbf24" /> {panel.watts}W
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#fbbf24" /> {panel.garantia} años
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
                  {panel.costo_panel_eur}€ <small style={{ fontSize: '0.8rem', color: '#94a3b8' }}>IVA incl.</small>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <a href={panel.link_compra} target="_blank" rel="noopener noreferrer" style={{
                    textDecoration: 'none', background: '#fbbf24', color: '#1e293b', padding: '12px',
                    borderRadius: '8px', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem'
                  }}>TIENDA</a>
                  <a href={panel.ficha_tecnica} target="_blank" rel="noopener noreferrer" style={{
                    textDecoration: 'none', background: '#334155', color: 'white', padding: '12px',
                    borderRadius: '8px', textAlign: 'center', border: '1px solid #475569'
                  }}><FileText size={18} style={{ margin: '0 auto' }} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <Search size={50} style={{ marginBottom: '20px', opacity: 0.5 }} />
          <p>No hay paneles que coincidan con estos filtros.</p>
          <button
            onClick={() => { setPriceFilter('all'); setWattsFilter('all'); }}
            style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
