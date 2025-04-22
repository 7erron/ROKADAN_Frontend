import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const { isAuthenticated, user, isAdmin, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        toast.info('Has cerrado sesión correctamente');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand text-light" to="/">
                   CABAÑAS ROKADAN
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav w-100">
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/">
                                <button className="btn btn-outline-light">
                                    <i className="bi bi-house"></i>
                                    &nbsp;Home
                                </button>
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/quienessomos">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-unlock"></i>
                                            &nbsp; QUIENES SOMOS
                                        </button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/cabañas">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-unlock"></i>
                                            &nbsp; CABAÑAS
                                        </button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/servicios">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-unlock"></i>
                                            &nbsp; SERVICIOS
                                        </button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/misreservas">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-calendar-check"></i>
                                            &nbsp; MIS RESERVAS
                                        </button>
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" to="/admin">
                                            <button className="btn btn-outline-warning">
                                                <i className="bi bi-shield-lock"></i>
                                                &nbsp; ADMIN
                                            </button>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger nav-link" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        &nbsp;CERRAR SESIÓN
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/login">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-key"></i>
                                            &nbsp;INICIAR SESIÓN
                                        </button>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/register">
                                        <button className="btn btn-outline-light">
                                            <i className="bi bi-person-plus"></i>
                                            &nbsp;REGISTRARSE
                                        </button>
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item ms-auto">
                            <Link className="nav-link" to="/pago">
                                <button className="btn btn-outline-success">
                                    <i className="bi bi-cart3"></i>
                                    &nbsp;PAGAR RESERVA
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;