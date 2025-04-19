import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [formData, setFormData] = useState({
        email: '',  // Cambiado de 'correo' a 'email'
        password: '' // Cambiado de 'pass' a 'password'
    });
    
    const [errors, setErrors] = useState({
        email: false,
        emailFormat: false,
        password: false,
        serverError: location.state?.sessionExpired ? 
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' : null
    });
    
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const validateForm = () => {
        const newErrors = {
            email: formData.email === '',
            emailFormat: formData.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
            password: formData.password === '',
            serverError: null
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                
                // Guardar el token en el contexto de autenticación
                login({
                    token: response.data.token,
                    user: response.data.data.usuario
                });
                
                // Redirigir a la página previa o al home
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } catch (error) {
                console.error('Error en login:', error);
                let errorMessage = 'Error al iniciar sesión';
                
                if (error.response) {
                    if (error.response.status === 401) {
                        errorMessage = 'Email o contraseña incorrectos';
                    } else if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                }
                
                setErrors({
                    ...errors,
                    serverError: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">Login</h3>
                        </div>
                        <div className="card-body">
                            {errors.serverError && 
                                <div className="alert alert-danger">{errors.serverError}</div>
                            }
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email || errors.emailFormat ? 'is-invalid' : ''}`}
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && 
                                        <div className="invalid-feedback">Por favor ingresa tu email</div>
                                    }
                                    {errors.emailFormat && 
                                        <div className="invalid-feedback">El formato del email no es válido</div>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && 
                                        <div className="invalid-feedback">Por favor ingresa tu contraseña</div>
                                    }
                                </div>
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                    </button>
                                </div>
                                <div className="mt-3 text-center">
                                    <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
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