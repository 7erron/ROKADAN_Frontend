import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminCabanas() {
    const [cabanas, setCabanas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulación de obtención de datos
        setTimeout(() => {
            const data = [
                {
                    id: 1,
                    nombre: "Cabaña El Pinar",
                    descripcion: "Hermosa cabaña en medio del bosque con vistas panorámicas.",
                    precio: 25000,
                    capacidad: 4,
                    imagen: "https://img.freepik.com/fotos-premium/cabana-ubicada-bosque-vistas-majestuosas-montanas-vista-panoramica-cabana-acogedora-ubicada-montanas-vista-panoramica_538213-117682.jpg?w=996",
                    disponible: true
                },
                {
                    id: 2,
                    nombre: "Cabaña La Montaña",
                    descripcion: "Acogedora cabaña de montaña ideal para desconectar.",
                    precio: 32000,
                    capacidad: 6,
                    imagen: "https://a0.muscache.com/im/pictures/cc8ea353-3f63-4d4d-ba2f-baac82e62318.jpg?im_w=1200",
                    disponible: true
                },
                {
                    id: 3,
                    nombre: "Cabaña El Lago",
                    descripcion: "Moderna cabaña con acceso directo al lago.",
                    precio: 45000,
                    capacidad: 8,
                    imagen: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/515320035.jpg?k=c51839eac8f74086e2d9a61f90dfdf0c739a632221bf4c08c88419ee47c696aa&o=",
                    disponible: true
                }
            ];
            setCabanas(data);
            setLoading(false);
        }, 500);
    }, []);

    const filteredCabanas = cabanas.filter(cabana =>
        cabana.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDisponibilidad = (id) => {
        setCabanas(cabanas.map(cabana =>
            cabana.id === id 
                ? { ...cabana, disponible: !cabana.disponible } 
                : cabana
        ));
    };

    const deleteCabana = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta cabaña?')) {
            setCabanas(cabanas.filter(cabana => cabana.id !== id));
        }
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success">Administrar Cabañas</h1>
                <Link to="/admin/cabanas/nueva" className="btn btn-success">
                    <i className="bi bi-plus"></i> Nueva Cabaña
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar cabañas..."
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
                                <th>Precio</th>
                                <th>Capacidad</th>
                                <th>Disponible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCabanas.map(cabana => (
                                <tr key={cabana.id}>
                                    <td>{cabana.id}</td>
                                    <td>{cabana.nombre}</td>
                                    <td>${cabana.precio}</td>
                                    <td>{cabana.capacidad} personas</td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={cabana.disponible}
                                                onChange={() => toggleDisponibilidad(cabana.id)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Link 
                                            to={`/admin/cabanas/editar/${cabana.id}`}
                                            className="btn btn-sm btn-primary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <Link 
                                            to={`/cabanas/${cabana.id}`}
                                            className="btn btn-sm btn-info me-2"
                                            target="_blank"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteCabana(cabana.id)}
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

export default AdminCabanas;