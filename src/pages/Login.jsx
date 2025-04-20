import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: !formData.email ? 'El email es requerido' : 
             !/^\S+@\S+\.\S+$/.test(formData.email) ? 'Email inválido' : '',
      password: !formData.password ? 'La contraseña es requerida' : ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });
      
      // Redirección basada en rol
      if (response.user.es_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email o contraseña incorrectos';
            break;
          case 400:
            errorMessage = 'Datos de inicio inválidos';
            break;
          case 500:
            errorMessage = 'Error del servidor. Intente más tarde';
            break;
        }
      }
      
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">Iniciar Sesión</h3>
            </div>
            
            <div className="card-body p-4">
              {errors.general && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {errors.general}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setErrors(prev => ({ ...prev, general: '' }))}
                  />
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                {/* Campo Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                
                {/* Campo Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  
                  <div className="text-end mt-2">
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none small"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>
                
                {/* Botón de Submit */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isLoading || !formData.email || !formData.password}
                  >
                    {isLoading ? (
                      <>
                        <span 
                          className="spinner-border spinner-border-sm" 
                          aria-hidden="true"
                        />
                        <span role="status"> Iniciando sesión...</span>
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-center">
                <p className="mb-0">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="text-success fw-semibold">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;