import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DetalleCabana() {
    const { id } = useParams();
    const [cabana, setCabana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabana = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/cabanas/${id}`);
                
                if (!response.data) {
                    throw new Error('No se recibieron datos de la cabaña');
                }

                // Normalizar estructura de respuesta
                const cabanaData = response.data;
                
                // Validar campos esenciales
                if (!cabanaData) {
                    throw new Error('Estructura de datos no válida');
                }

                // Asegurar que la imagen tenga un valor
                if (!cabanaData.imagen) {
                    console.warn('Cabaña sin imagen, usando placeholder');
                    cabanaData.imagen = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                }

                setCabana(cabanaData);
                setError(null);
            } catch (err) {
                console.error("Error al cargar cabaña:", {
                    message: err.message,
                    response: err.response,
                    stack: err.stack
                });
                
                setError(
                    err.response?.data?.error || 
                    'Error al cargar los detalles de la cabaña'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCabana();
    }, [id]);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando detalles de la cabaña...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger text-center">
                    {error}
                    <div className="mt-3">
                        <Link to="/cabanas" className="btn btn-primary">
                            Volver a Cabañas
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!cabana) {
        return (
            <div className="container my-5 text-center">
                <h2>Cabaña no encontrada</h2>
                <p>La cabaña solicitada no existe o no está disponible</p>
                <Link to="/cabanas" className="btn btn-primary mt-3">
                    Volver a Cabañas
                </Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                    <img 
                        src={cabana.imagen}
                        alt={`Cabaña ${cabana.nombre}`}
                        className="img-fluid rounded shadow"
                        style={{
                            height: "400px",
                            width: "100%",
                            objectFit: "cover"
                        }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-success mb-3">{cabana.nombre}</h1>
                    <p className="lead">{cabana.descripcion}</p>
                    
                    <ul className="list-group mb-4">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Precio por noche:</strong>
                            <span>${cabana.precio.toLocaleString('es-CL')}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Capacidad:</strong>
                            <span>{cabana.capacidad} personas</span>
                        </li>
                    </ul>
                    
                    <div className="d-flex gap-3">
                        <Link 
                            to={`/reservas/${cabana.id}`} 
                            className="btn btn-success btn-lg flex-grow-1"
                        >
                            Reservar ahora
                        </Link>
                        <Link 
                            to="/cabanas" 
                            className="btn btn-outline-secondary btn-lg"
                        >
                            Ver más cabañas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleCabana;