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
        correo: '',
        telefono: '',
        pass: '',
        confirmPass: ''
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
            correo: formData.correo === '',
            correoFormat: formData.correo !== '' && !formData.correo.includes('@'),
            telefono: formData.telefono === '',
            telefonoFormat: formData.telefono !== '' && !/^\d{9,10}$/.test(formData.telefono),
            pass: formData.pass === '',
            passLength: formData.pass !== '' && formData.pass.length < 6,
            confirmPass: formData.confirmPass === '',
            passwordsMatch: formData.pass !== formData.confirmPass && formData.confirmPass !== '',
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
                    email: formData.correo,
                    telefono: formData.telefono,
                    password: formData.pass,
                    confirmPassword: formData.confirmPass
                });
                
                login(response.data.data.usuario);
                navigate('/');
                alert("¡Registro exitoso! Bienvenido/a " + formData.nombre);
            } catch (error) {
                console.error('Error en registro:', error);
                let errorMessage = 'Error al registrar usuario';
                
                if (error.response) {
                    if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data?.errors) {
                        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
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
                            <form onSubmit={handleSubmit}>
                                {errors.serverError && 
                                    <div className="alert alert-danger">{errors.serverError}</div>
                                }
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
                                
                                {/* Resto del formulario similar, con validaciones mejoradas */}
                                
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