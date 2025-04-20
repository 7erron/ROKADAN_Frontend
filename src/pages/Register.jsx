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
        
        // Validación en tiempo real
        if (name === 'email') {
            setErrors(prev => ({
                ...prev,
                emailFormat: value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            }));
        }
        
        if (name === 'telefono') {
            setErrors(prev => ({
                ...prev,
                telefonoFormat: value !== '' && !/^\d{9,10}$/.test(value)
            }));
        }
        
        if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                passwordLength: value !== '' && value.length < 6
            }));
        }
        
        if (name === 'confirmPassword') {
            setErrors(prev => ({
                ...prev,
                passwordsMatch: value !== formData.password
            }));
        }
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
            passwordsMatch: formData.password !== formData.confirmPassword,
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
                const response = await api.post('/api/auth/registrar', {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                });
                
                // Guardar token y datos del usuario
                login({
                    token: response.token,
                    user: response.data.usuario
                });
                
                // Redirigir al dashboard o página principal
                navigate('/', { 
                    state: { 
                        registrationSuccess: true,
                        userName: formData.nombre 
                    } 
                });
                
            } catch (error) {
                console.error('Error en registro:', error);
                
                let errorMessage = 'Error al registrar el usuario';
                if (error.response) {
                    if (error.response.status === 400 && error.response.data.errors) {
                        // Mostrar todos los errores de validación del backend
                        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
                    } else if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.status === 409) {
                        errorMessage = 'Este correo electrónico ya está registrado';
                    }
                }
                
                setErrors(prev => ({
                    ...prev,
                    serverError: errorMessage
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0 text-center">Registro de Usuario</h3>
                        </div>
                        <div className="card-body p-4">
                            {errors.serverError && (
                                <div className="alert alert-danger">
                                    {errors.serverError}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingrese su nombre"
                                            required
                                        />
                                        {errors.nombre && (
                                            <div className="invalid-feedback">El nombre es obligatorio</div>
                                        )}
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
                                            required
                                        />
                                        {errors.apellido && (
                                            <div className="invalid-feedback">El apellido es obligatorio</div>
                                        )}
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
                                        required
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">El correo electrónico es obligatorio</div>
                                    )}
                                    {errors.emailFormat && (
                                        <div className="invalid-feedback">Ingrese un correo electrónico válido</div>
                                    )}
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
                                        placeholder="Ejemplo: 987654321"
                                        required
                                    />
                                    {errors.telefono && (
                                        <div className="invalid-feedback">El teléfono es obligatorio</div>
                                    )}
                                    {errors.telefonoFormat && (
                                        <div className="invalid-feedback">El teléfono debe tener 9-10 dígitos</div>
                                    )}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password || errors.passwordLength ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Mínimo 6 caracteres"
                                            required
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">La contraseña es obligatoria</div>
                                        )}
                                        {errors.passwordLength && (
                                            <div className="invalid-feedback">La contraseña debe tener al menos 6 caracteres</div>
                                        )}
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
                                            placeholder="Repita su contraseña"
                                            required
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">Debe confirmar su contraseña</div>
                                        )}
                                        {errors.passwordsMatch && (
                                            <div className="invalid-feedback">Las contraseñas no coinciden</div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-check mb-4">
                                    <input
                                        className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                                        type="checkbox"
                                        id="terminos"
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="terminos">
                                        Acepto los <a href="/terminos" className="text-decoration-none">términos y condiciones</a>
                                    </label>
                                </div>

                                <div className="d-grid mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Registrando...
                                            </>
                                        ) : 'Registrarse'}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="mb-0">
                                        ¿Ya tienes una cuenta?{' '}
                                        <Link to="/login" className="text-success fw-semibold text-decoration-none">
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
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