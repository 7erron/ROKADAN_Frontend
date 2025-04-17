import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({
        correo: false,
        correoFormat: false,
        pass: false,
        passLength: false
    });
    
    const [apiError, setApiError] = useState(null);
    
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
            emailFormat: formData.email !== '' && !formData.email.includes('@'),
            password: formData.password === '',
            passwordLength: formData.password !== '' && formData.password.length < 6
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        
        if (validateForm()) {
            try {
                const response = await axios.post(
                    'https://rokadan-backend.onrender.com/api/auth/login',
                    {
                        email: formData.email,
                        password: formData.password
                    }
                );
                
                // Guardar token y datos de usuario
                login({ 
                    token: response.data.token,
                    user: response.data.data.usuario
                });
                
                // Redirigir según rol
                if (response.data.data.usuario.es_admin) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Error en login:", error);
                setApiError(error.response?.data?.message || "Error al iniciar sesión");
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
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    {errors.correo && 
                                        <div className="alert alert-danger">Debes ingresar tu email</div>
                                    }
                                    {errors.correoFormat && 
                                        <div className="alert alert-danger">El formato del email no es válido</div>
                                    }
                                    <label htmlFor="correo" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    {errors.pass && 
                                        <div className="alert alert-danger">Debes ingresar tu contraseña</div>
                                    }
                                    {errors.passLength && 
                                        <div className="alert alert-danger">Tu contraseña debe tener al menos 6 caracteres</div>
                                    }
                                    <label htmlFor="pass" className="form-label">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success">Iniciar Sesión</button>
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