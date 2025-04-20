import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const { isAuthenticated, user, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info('Has cerrado sesión correctamente');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand text-light d-flex align-items-center" to="/">
                    <i className="bi bi-house-door me-2"></i>
                    CABAÑAS ROKADAN
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent" 
                    aria-controls="navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="bi bi-house"></i> Inicio
                            </Link>
                        </li>
                        
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cabanas">
                                        <i className="bi bi-building"></i> Cabañas
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/servicios">
                                        <i className="bi bi-list-check"></i> Servicios
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/misreservas">
                                        <i className="bi bi-calendar-check"></i> Mis Reservas
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-warning" to="/admin">
                                            <i className="bi bi-shield-lock"></i> Administración
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
                        {isAuthenticated ? (
                            <>
                                <div className="text-light me-3 d-none d-md-block">
                                    <i className="bi bi-person-circle me-1"></i>
                                    <span>{user?.nombre || 'Usuario'}</span>
                                </div>
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right"></i> Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    className="btn btn-outline-light me-2" 
                                    to="/login"
                                >
                                    <i className="bi bi-box-arrow-in-right"></i> Ingresar
                                </Link>
                                <Link 
                                    className="btn btn-success" 
                                    to="/register"
                                >
                                    <i className="bi bi-person-plus"></i> Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;