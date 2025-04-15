import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api';


function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        correo: '',
        pass: ''
    });
    
    const [errors, setErrors] = useState({
        correo: false,
        correoFormat: false,
        pass: false,
        passLength: false
    });
    
    const [submitError, setSubmitError] = useState(null);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const validateForm = () => {
        const newErrors = {
            correo: formData.correo === '',
            correoFormat: formData.correo !== '' && !formData.correo.includes('@'),
            pass: formData.pass === '',
            passLength: formData.pass !== '' && formData.pass.length < 6
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        
        if (!validateForm()) return;

        try {
            const userData = await loginUser({
                email: formData.correo,
                password: formData.pass
            });
            
            login(userData);
            
            if (userData.es_admin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Error en login:', err);
            setSubmitError(err.message || 'Credenciales incorrectas');
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
                                        id="correo" 
                                        name="correo" 
                                        value={formData.correo}
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
                                        id="pass" 
                                        name="pass" 
                                        value={formData.pass}
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