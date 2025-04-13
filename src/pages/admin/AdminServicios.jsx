import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminServicios() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulación de obtención de datos
        setTimeout(() => {
            const data = [
                {
                    id: 1,
                    titulo: "Desayuno Incluido",
                    descripcion: "Disfruta de un desayuno completo con productos locales y caseros.",
                    icono: "bi-cup-hot",
                    precio: 5000,
                    activo: true
                },
                {
                    id: 2,
                    titulo: "WiFi Gratis",
                    descripcion: "Mantente conectado con conexión WiFi de alta velocidad en todas nuestras cabañas.",
                    icono: "bi-wifi",
                    precio: 0,
                    activo: true
                },
                {
                    id: 3,
                    titulo: "Piscina",
                    descripcion: "Relájate en nuestra piscina con vistas panorámicas al bosque.",
                    icono: "bi-water",
                    precio: 10000,
                    activo: true
                }
            ];
            setServicios(data);
            setLoading(false);
        }, 500);
    }, []);

    const filteredServicios = servicios.filter(servicio =>
        servicio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleActivo = (id) => {
        setServicios(servicios.map(servicio =>
            servicio.id === id 
                ? { ...servicio, activo: !servicio.activo } 
                : servicio
        ));
    };

    const deleteServicio = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
            setServicios(servicios.filter(servicio => servicio.id !== id));
        }
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success">Administrar Servicios</h1>
                <Link to="/admin/servicios/nuevo" className="btn btn-success">
                    <i className="bi bi-plus"></i> Nuevo Servicio
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServicios.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.titulo}</td>
                                    <td>{servicio.descripcion}</td>
                                    <td>${servicio.precio}</td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={servicio.activo}
                                                onChange={() => toggleActivo(servicio.id)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Link 
                                            to={`/admin/servicios/editar/${servicio.id}`}
                                            className="btn btn-sm btn-primary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteServicio(servicio.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminServicios;