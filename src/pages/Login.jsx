import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });
      
      toast.success(`¡Bienvenido ${response.user.nombre}!`, {
        autoClose: 2000,
        onClose: () => {
          if (response.user.es_admin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }
      });
      
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email o contraseña incorrectos';
            break;
          case 400:
            errorMessage = 'Datos de inicio inválidos';
            break;
          default:
            errorMessage = 'Error del servidor. Intente más tarde';
        }
      }
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">Iniciar Sesión</h3>
            </div>
            
            <div className="card-body p-4">
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
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Iniciando sesión...
                      </>
                    ) : 'Iniciar Sesión'}
                  </button>
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