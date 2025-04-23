import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const { login } = useContext(AuthContext);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error al escribir
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: !formData.email ? 'El email es obligatorio' : '',
      password: !formData.password ? 'La contraseña es obligatoria' : ''
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);
      login(response.user, response.token);  // Almacenar el usuario y token en el contexto

      // Redirigir según el rol del usuario
      if (response.user.es_admin) {
        toast.success(`Bienvenido Administrador ${response.user.nombre}`);
        navigate('/admin'); // Redirige a la página de administración si es administrador
      } else {
        toast.success(`Bienvenido ${response.user.nombre}`);
        navigate('/');  // Redirige a la página principal si no es administrador
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
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
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
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

                {/* Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
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
                    <Link to="/forgot-password" className="text-decoration-none small">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* Botón */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
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
