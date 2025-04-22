import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    specialChar: false
  });

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {...formData, [name]: value};
    setFormData(updatedForm);

    if (name === 'password') {
      setPasswordRequirements({
        length: value.length < 8,
        number: !/[0-9]/.test(value),
        lowercase: !/[a-z]/.test(value),
        uppercase: !/[A-Z]/.test(value),
        specialChar: !/[\W_]/.test(value)
      });
    }

    if (name === 'password' || name === 'confirmPassword') {
      const mismatch = updatedForm.password !== updatedForm.confirmPassword;
      setPasswordsMismatch(mismatch && !!updatedForm.confirmPassword);
    }
  };

  const validateForm = () => {
    const isPasswordValid = !Object.values(passwordRequirements).some(req => req);
    return (
      formData.nombre &&
      formData.apellido &&
      formData.email &&
      formData.telefono &&
      formData.password &&
      formData.confirmPassword &&
      isPasswordValid &&
      !passwordsMismatch
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser(formData);
      toast.success('¡Registro exitoso! Redirigiendo...', {
        autoClose: 2000,
        onClose: () => navigate('/login')
      });
    } catch (error) {
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <ToastContainer position="top-center" />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Registro de Usuario</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Campos de nombre, apellido, email y teléfono */}
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
                      required
                    />
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
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
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
                    required
                  />
                </div>

                {/* Campo de contraseña con validaciones */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${Object.values(passwordRequirements).some(req => req) ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    <ul className="list-unstyled">
                      <li className={passwordRequirements.length ? 'text-danger' : 'text-success'}>
                        {passwordRequirements.length ? '✖' : '✓'} Mínimo 8 caracteres
                      </li>
                      <li className={passwordRequirements.number ? 'text-danger' : 'text-success'}>
                        {passwordRequirements.number ? '✖' : '✓'} Al menos un número
                      </li>
                      <li className={passwordRequirements.lowercase ? 'text-danger' : 'text-success'}>
                        {passwordRequirements.lowercase ? '✖' : '✓'} Al menos una minúscula
                      </li>
                      <li className={passwordRequirements.uppercase ? 'text-danger' : 'text-success'}>
                        {passwordRequirements.uppercase ? '✖' : '✓'} Al menos una mayúscula
                      </li>
                      <li className={passwordRequirements.specialChar ? 'text-danger' : 'text-success'}>
                        {passwordRequirements.specialChar ? '✖' : '✓'} Al menos un carácter especial
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Campo de confirmación de contraseña */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${passwordsMismatch ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {passwordsMismatch && (
                    <div className="invalid-feedback">Las contraseñas no coinciden</div>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={!validateForm() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Procesando...
                      </>
                    ) : 'Registrarse'}
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