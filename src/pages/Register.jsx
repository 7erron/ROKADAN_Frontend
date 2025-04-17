import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Notification from '../components/Notification';
import { FaCheckCircle } from 'react-icons/fa';

function Register() {
    const { register } = useContext(AuthContext);
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
        correo: false,
        correoFormat: false,
        telefono: false,
        telefonoFormat: false,
        pass: false,
        passLength: false,
        confirmPass: false,
        passwordsMatch: false
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
            nombre: formData.nombre === '',
            apellido: formData.apellido === '',
            email: formData.email === '',
            emailFormat: formData.email !== '' && !formData.email.includes('@'),
            telefono: formData.telefono === '',
            telefonoFormat: formData.telefono !== '' && !/^\d{9,10}$/.test(formData.telefono),
            password: formData.password === '',
            passwordLength: formData.password !== '' && formData.password.length < 6,
            confirmPassword: formData.confirmPassword === '',
            passwordsMatch: formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                await register(formData);
                // Redirigir a la página principal
                navigate('/');
                // Mostrar alerta de registro exitoso
                alert("¡Registro exitoso! Bienvenido/a " + formData.nombre);
            } catch (error) {
                console.error("Error en registro:", error);
                alert("Error al registrar. Por favor, intente nuevamente.");
            }

          try {
            const response = await axios.post(
              'https://rokadan-backend.onrender.com/api/auth/registrar',
              {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                email: formData.email.toLowerCase().trim(),
                telefono: formData.telefono.trim(),
                password: formData.password,
                passwordConfirm: formData.confirmPassword
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (response.data.status === 'success') {
                login({ 
                    email: formData.correo,
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    id: response.data.data.usuario.id
                });
                
                // Mostrar notificación de éxito
                setNotificationMessage({
                    text: `¡Felicidades ${formData.nombre}! Tu registro fue exitoso`,
                    type: 'success'
                });
                setShowNotification(true);
                
                // Ocultar después de 5 segundos
                setTimeout(() => setShowNotification(false), 5000);
                
                // Redirigir a home
                navigate('/');
            }
        } catch (error) {
            console.error("Error en registro:", error);
            setNotificationMessage({
                text: error.response?.data?.message || 'Error en el registro',
                type: 'error'
            });
            setShowNotification(true);
        }
    }
};

    return (
        <div className="container my-4">
            {showNotification && (
                <Notification 
                    message={notificationMessage.text}
                    type={notificationMessage.type}
                    onClose={() => setShowNotification(false)}
                />
            )}
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">Registro de Usuario</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="nombre" 
                                            name="nombre" 
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingrese su nombre"
                                        />
                                        {errors.nombre && 
                                            <div className="text-danger mt-1">El nombre es obligatorio</div>
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="apellido" className="form-label">Apellido</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="apellido" 
                                            name="apellido" 
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            placeholder="Ingrese su apellido"
                                        />
                                        {errors.apellido && 
                                            <div className="text-danger mt-1">El apellido es obligatorio</div>
                                        }
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.correo && 
                                        <div className="text-danger mt-1">El correo electrónico es obligatorio</div>
                                    }
                                    {errors.correoFormat && 
                                        <div className="text-danger mt-1">Formato de correo electrónico inválido</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="telefono" 
                                        name="telefono" 
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="Ingrese su número de teléfono"
                                    />
                                    {errors.telefono && 
                                        <div className="text-danger mt-1">El teléfono es obligatorio</div>
                                    }
                                    {errors.telefonoFormat && 
                                        <div className="text-danger mt-1">El teléfono debe tener entre 9 y 10 dígitos</div>
                                    }
                                </div>
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="pass" className="form-label">Contraseña</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Ingrese su contraseña"
                                        />
                                        {errors.pass && 
                                            <div className="text-danger mt-1">La contraseña es obligatoria</div>
                                        }
                                        {errors.passLength && 
                                            <div className="text-danger mt-1">La contraseña debe tener al menos 6 caracteres</div>
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="confirmPass" className="form-label">Confirmar Contraseña</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirme su contraseña"
                                        />
                                        {errors.confirmPass && 
                                            <div className="text-danger mt-1">Debe confirmar su contraseña</div>
                                        }
                                        {errors.passwordsMatch && 
                                            <div className="text-danger mt-1">Las contraseñas no coinciden</div>
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
                                    <button type="submit" className="btn btn-success">
                                        <i className="bi bi-person-plus"></i> Registrarse
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