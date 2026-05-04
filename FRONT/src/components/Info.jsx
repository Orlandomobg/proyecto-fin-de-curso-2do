import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Cpu, ShoppingCart, Check,
  Zap, Rocket, Building2, BarChart4, TrendingUp, History
} from 'lucide-react';

// Value proposition card (Vision, Precision, Marketplace)
const ValueCard = ({ icon: Icon, title, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05 }}
    style={{
      flex: 1,
      padding: '2rem',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      minWidth: '280px'
    }}
  >
    <div style={{ color: '#fbbf24', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
      <Icon size={40} />
    </div>
    <h3 style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
      {title}
    </h3>
    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
      {text}
    </p>
  </motion.div>
);

// Subscription pricing card
const PricingCard = ({ title, price, features, icon: Icon, popular, delay, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{
      flex: 1,
      minWidth: '300px',
      padding: '2.5rem 2rem',
      borderRadius: '24px',
      background: popular ? 'linear-gradient(145deg, #1e293b, #0f172a)' : 'rgba(255, 255, 255, 0.03)',
      border: popular ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    {popular && (
      <span style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#fbbf24', color: '#1e293b', padding: '4px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
        RECOMENDADO
      </span>
    )}
    <div style={{ color: popular ? '#fbbf24' : '#94a3b8', marginBottom: '1rem' }}>
      <Icon size={35} style={{ margin: '0 auto' }} />
    </div>
    <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem' }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{subtitle}</p>

    <div style={{ marginBottom: '2rem' }}>
      <span style={{ fontSize: '2.8rem', fontWeight: '900', color: 'white' }}>{price}€</span>
      <span style={{ color: '#94a3b8', fontSize: '1.1rem' }}>/mes</span>
    </div>

    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem', textAlign: 'left', flexGrow: 1 }}>
      {features.map((feature, index) => (
        <li key={index} style={{ color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'start', gap: '10px', fontSize: '0.95rem', lineHeight: '1.4' }}>
          <Check size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} /> {feature}
        </li>
      ))}
    </ul>

    <button style={{
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      background: popular ? '#fbbf24' : 'rgba(255,255,255,0.08)',
      color: popular ? '#1e293b' : 'white',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}>
      Suscribirse
    </button>
  </motion.div>
);

function Info() {
  return (
    <div style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '80px 20px' }}>

      {/* SECTION 1: VALUE PROPOSITIONS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '100px', justifyContent: 'center' }}>
        <ValueCard
          icon={ShieldCheck}
          title="Visión Solaris"
          text="Democratizando la Ingeniería Solar con IA Avanzada. Precisión técnica y transparencia total para tu hogar."
          delay={0.1}
        />
        <ValueCard
          icon={Cpu}
          title="Precisión IA"
          text="<5% de margen de error vs 20% de la industria. Entrenada con 20 años de datos climáticos de la NASA."
          delay={0.2}
        />
        <ValueCard
          icon={ShoppingCart}
          title="Marketplace"
          text="Conectamos usuarios con instaladoras certificadas. Sin sesgos comerciales ni sobredimensionamiento."
          delay={0.3}
        />
      </div>

      {/* SECTION 2: SUBSCRIPTION PLANS */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
          PLANES DE SUSCRIPCIÓN
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Simulaciones ilimitadas en todos los planes. Elige el nivel de seguimiento que necesitas.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'stretch' }}>
        {/* FREE PLAN */}
        <PricingCard
          title="Básico"
          subtitle="Para curiosos"
          price="0"
          icon={Zap}
          features={[
            "Simulaciones de ahorro sin límites",
            "Acceso a marketplace de instaladores",
            "Link directo con técnicos certificados",
            "Ficha técnica básica del panel"
          ]}
          delay={0.1}
        />

        {/* INDIVIDUAL PLAN (POPULAR) */}
        <PricingCard
          title="Particular"
          subtitle="Dueños de casa"
          price="10"
          icon={Rocket}
          popular={true}
          features={[
            "Todo lo del Plan Básico",
            "Dashboard mensual de rendimiento",
            "Cálculo real de ahorro acumulado",
            "Seguimiento de ROI (Retorno de Inversión)",
            "Alertas de mantenimiento preventivo"
          ]}
          delay={0.2}
        />

        {/* BUSINESS PLAN */}
        <PricingCard
          title="Empresa"
          subtitle="Pymes y naves"
          price="25"
          icon={Building2}
          features={[
            "Todo lo del Plan Particular",
            "Gestión de múltiples instalaciones",
            "Informes de sostenibilidad corporativa",
            "Análisis de eficiencia a gran escala",
            "Soporte técnico dedicado"
          ]}
          delay={0.3}
        />
      </div>
    </div>
  );
}

export default Info;
