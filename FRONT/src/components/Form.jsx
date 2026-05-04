import React, { useState } from 'react';
import { Sun, Home, Compass, BarChart3, ShieldCheck } from 'lucide-react';

const Form = ({ onDataReceived }) => {
  // Internal form state
  const [formData, setFormData] = useState({
    gasto: '',
    superficie: '',
    inclinacion: '30',
    orientacion: 'sur',
    prioridad: 'eficiencia'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataReceived(formData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid #334155',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>

        {/* INPUT GRID (2 COLUMNS) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f1f5f9', fontWeight: '600' }}>
              <Home size={18} color="#fbbf24" /> Gasto Mensual (€)
            </label>
            <input
              type="number"
              name="gasto"
              value={formData.gasto}
              onChange={handleChange}
              placeholder="Ej: 90"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f1f5f9', fontWeight: '600' }}>
              <Sun size={18} color="#fbbf24" /> Superficie Techo (m²)
            </label>
            <input
              type="number"
              name="superficie"
              value={formData.superficie}
              onChange={handleChange}
              placeholder="Ej: 30"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f1f5f9', fontWeight: '600' }}>
              <BarChart3 size={18} color="#fbbf24" /> Inclinación (°)
            </label>
            <input
              type="number"
              name="inclinacion"
              value={formData.inclinacion}
              onChange={handleChange}
              placeholder="Ej: 30"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f1f5f9', fontWeight: '600' }}>
              <Compass size={18} color="#fbbf24" /> Orientación
            </label>
            <select
              name="orientacion"
              value={formData.orientacion}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            >
              <option value="sur">Sur (Máximo sol)</option>
              <option value="este">Este</option>
              <option value="oeste">Oeste</option>
              <option value="norte">Norte</option>
            </select>
          </div>
        </div>

        {/* PRIORITY SECTION (FULL WIDTH) */}
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#fbbf24', fontWeight: '700' }}>
            <ShieldCheck size={18} /> Prioridad del Análisis
          </label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            style={{
              width: '100%', padding: '15px', borderRadius: '12px', background: '#0f172a',
              border: '2px solid #fbbf24', color: 'white', fontWeight: 'bold'
            }}
          >
            <option value="economico">Económico (Inversión mínima)</option>
            <option value="potencia">Máxima Potencia (Generar más)</option>
            <option value="garantia">Calidad Premium (Mayor garantía)</option>
            <option value="eficiencia">Equilibrio (Eficiencia/Precio)</option>
          </select>
        </div>

        <button type="submit" style={{
          width: '100%', padding: '20px', fontSize: '1.2rem', fontWeight: '900',
          background: '#fbbf24', color: '#1e293b', border: 'none', borderRadius: '12px',
          cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.4)'
        }}>
          CALCULAR SISTEMA CON IA
        </button>
      </form>
    </div>
  );
};

export default Form;
