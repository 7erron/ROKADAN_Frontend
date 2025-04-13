import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="container my-5">
            <h1 className="text-center text-success mb-5">Panel de Administración</h1>
            
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-house-door fs-1 text-primary"></i>
                            <h5 className="card-title mt-3">Cabañas</h5>
                            <p className="card-text">Administra las cabañas disponibles</p>
                            <Link to="/admin/cabanas" className="btn btn-primary">
                                Gestionar Cabañas
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-list-check fs-1 text-success"></i>
                            <h5 className="card-title mt-3">Servicios</h5>
                            <p className="card-text">Administra los servicios adicionales</p>
                            <Link to="/admin/servicios" className="btn btn-success">
                                Gestionar Servicios
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-calendar-check fs-1 text-info"></i>
                            <h5 className="card-title mt-3">Reservas</h5>
                            <p className="card-text">Gestiona las reservas de los clientes</p>
                            <Link to="/admin/reservas" className="btn btn-info">
                                Gestionar Reservas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;