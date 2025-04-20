import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

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

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    match: true
  });

  const [submitError, setSubmitError] = useState('');

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({...formData, password: value});
    
    setPasswordErrors({
      length: value.length < 8,
      number: !/[0-9]/.test(value),
      lowercase: !/[a-z]/.test(value),
      uppercase: !/[A-Z]/.test(value),
      specialChar: !/[\W_]/.test(value),
      match: value !== formData.confirmPassword && formData.confirmPassword !== ''
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({...formData, confirmPassword: value});
    setPasswordErrors({...passwordErrors, match: value !== formData.password});
  };

  const validateForm = () => {
    return (
      formData.nombre &&
      formData.apellido &&
      formData.email &&
      formData.telefono &&
      !Object.values(passwordErrors).some(error => error)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      setSubmitError('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'Error al registrarse');
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
              {submitError && (
                <div className="alert alert-danger">{submitError}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Campos de nombre, apellido, email y teléfono... */}

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${passwordErrors.length || passwordErrors.number || 
                      passwordErrors.lowercase || passwordErrors.uppercase || 
                      passwordErrors.specialChar ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="Ingrese su contraseña"
                  />
                  <div className="invalid-feedback">
                    <ul className="list-unstyled">
                      <li className={passwordErrors.length ? 'text-danger' : 'text-success'}>
                        {passwordErrors.length ? '✖' : '✓'} Mínimo 8 caracteres
                      </li>
                      <li className={passwordErrors.number ? 'text-danger' : 'text-success'}>
                        {passwordErrors.number ? '✖' : '✓'} Al menos un número
                      </li>
                      <li className={passwordErrors.lowercase ? 'text-danger' : 'text-success'}>
                        {passwordErrors.lowercase ? '✖' : '✓'} Al menos una minúscula
                      </li>
                      <li className={passwordErrors.uppercase ? 'text-danger' : 'text-success'}>
                        {passwordErrors.uppercase ? '✖' : '✓'} Al menos una mayúscula
                      </li>
                      <li className={passwordErrors.specialChar ? 'text-danger' : 'text-success'}>
                        {passwordErrors.specialChar ? '✖' : '✓'} Al menos un carácter especial
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${passwordErrors.match ? '' : 'is-invalid'}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirme su contraseña"
                  />
                  {!passwordErrors.match && (
                    <div className="invalid-feedback">Las contraseñas no coinciden</div>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={!validateForm()}
                  >
                    Registrarse
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