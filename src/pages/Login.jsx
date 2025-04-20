import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api'
import { AuthContext } from '../context/AuthContext';
import api from '../api';
// hasta aca
function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!formData.email || !formData.password) {
        setError('Todos los campos son obligatorios');
        return;
      }
  
      try {
        const response = await loginUser(formData);
        
        if (response.success) {
          navigate(response.user.es_admin ? '/admin' : '/');
        }
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión');
      }
    };
  
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0">Iniciar Sesión</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Iniciar Sesión
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;