import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: ""
  });

  const handleInput = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value });
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2>REGISTRO</h2>
      <form className="formulario" onSubmit={(e) => e.preventDefault()}>
        <div className="form-container">
          <input type="text"     placeholder="Nombre"              onChange={handleInput} id="nombre" />
          <input type="text"     placeholder="Apellido"            onChange={handleInput} id="apellido" />
          <input type="email"    placeholder="Correo electrónico"  onChange={handleInput} id="correo" />
          <input type="password" placeholder="Contraseña"          onChange={handleInput} id="contraseña" />

          <button className="btn-submit">CREAR CUENTA</button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
