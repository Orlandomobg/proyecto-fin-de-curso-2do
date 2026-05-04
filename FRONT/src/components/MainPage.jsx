import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ color: '#fbbf24', fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }}
      >
        SOLAR IA
      </div>

      <nav>
        <ul className="nav-links">
          <li><Link to="/" className="nav-item-link">Inicio</Link></li>
          <li><Link to="/calculadora" className="nav-item-link">Calculadora</Link></li>
          <li><Link to="/catalogo" className="nav-item-link">Paneles</Link></li>
          <li><Link to="/perfil" className="nav-item-link">Perfil</Link></li>
          <li>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          </li>
          <li>
            <button className="btn-register" onClick={() => navigate("/register")}>
              Registro
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainPage;
