import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '', 
        telefono: '',
        password: '', 
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({
        nombre: false,
        apellido: false,
        email: false,
        emailFormat: false,
        telefono: false,
        telefonoFormat: false,
        password: false,
        passwordLength: false,
        confirmPassword: false,
        passwordsMatch: false,
        serverError: null
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
            nombre: formData.nombre === '',
            apellido: formData.apellido === '',
            email: formData.email === '',
            emailFormat: formData.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
            telefono: formData.telefono === '',
            telefonoFormat: formData.telefono !== '' && !/^\d{9,10}$/.test(formData.telefono),
            password: formData.password === '',
            passwordLength: formData.password !== '' && formData.password.length < 6,
            confirmPassword: formData.confirmPassword === '',
            passwordsMatch: formData.password !== formData.confirmPassword && formData.confirmPassword !== '',
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
                const response = await api.post('/auth/registrar', {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                });
                
                // Guardar el token y datos del usuario
                login({
                    token: response.data.token,
                    user: response.data.data.usuario
                });
                
                navigate('/');
                alert("¡Registro exitoso! Bienvenido/a " + formData.nombre);
            } catch (error) {
                console.error('Error en registro:', error);
                let errorMessage = 'Error al registrar el usuario';
                
                if (error.response) {
                    if (error.response.status === 400) {
                        if (error.response.data?.errors) {
                            errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
                        } else if (error.response.data?.message) {
                            errorMessage = error.response.data.message;
                        }
                    } else if (error.response.status === 409) {
                        errorMessage = 'Este correo electrónico ya está registrado';
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
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">Registro de Usuario</h3>
                        </div>
                        <div className="card-body">
                            {errors.serverError && 
                                <div className="alert alert-danger">{errors.serverError}</div>
                            }
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            id="nombre" 
                                            name="nombre" 
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingrese su nombre"
                                        />
                                        {errors.nombre && 
                                            <div className="invalid-feedback">El nombre es obligatorio</div>
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="apellido" className="form-label">Apellido</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                                            id="apellido" 
                                            name="apellido" 
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            placeholder="Ingrese su apellido"
                                        />
                                        {errors.apellido && 
                                            <div className="invalid-feedback">El apellido es obligatorio</div>
                                        }
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email || errors.emailFormat ? 'is-invalid' : ''}`}
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.email && 
                                        <div className="invalid-feedback">El correo electrónico es obligatorio</div>
                                    }
                                    {errors.emailFormat && 
                                        <div className="invalid-feedback">Formato de correo electrónico inválido</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        className={`form-control ${errors.telefono || errors.telefonoFormat ? 'is-invalid' : ''}`}
                                        id="telefono" 
                                        name="telefono" 
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="Ingrese su número de teléfono"
                                    />
                                    {errors.telefono && 
                                        <div className="invalid-feedback">El teléfono es obligatorio</div>
                                    }
                                    {errors.telefonoFormat && 
                                        <div className="invalid-feedback">El teléfono debe tener entre 9 y 10 dígitos</div>
                                    }
                                </div>
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password || errors.passwordLength ? 'is-invalid' : ''}`}
                                            id="password" 
                                            name="password" 
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Ingrese su contraseña"
                                        />
                                        {errors.password && 
                                            <div className="invalid-feedback">La contraseña es obligatoria</div>
                                        }
                                        {errors.passwordLength && 
                                            <div className="invalid-feedback">La contraseña debe tener al menos 6 caracteres</div>
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.confirmPassword || errors.passwordsMatch ? 'is-invalid' : ''}`}
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirme su contraseña"
                                        />
                                        {errors.confirmPassword && 
                                            <div className="invalid-feedback">Debe confirmar su contraseña</div>
                                        }
                                        {errors.passwordsMatch && 
                                            <div className="invalid-feedback">Las contraseñas no coinciden</div>
                                        }
                                    </div>
                                </div>
                                
                                <div className="form-check mb-3">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="terminos" 
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="terminos">
                                        Acepto los términos y condiciones
                                    </label>
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Registrando...' : 'Registrarse'}
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

export default Register;