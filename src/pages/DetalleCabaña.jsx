import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCabanaById } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function DetalleCabana() {
    const { id } = useParams();
    const [cabana, setCabana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabana = async () => {
            try {
                const data = await getCabanaById(id);
                
                // Manejo de diferentes estructuras de respuesta
                const cabanaData = data.data?.cabana || data.cabana || data;
                
                if (!cabanaData) {
                    throw new Error('No se encontró la cabaña');
                }

                // Establecer imagen por defecto si no viene
                if (!cabanaData.imagen) {
                    cabanaData.imagen = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                }

                setCabana(cabanaData);
                setError(null);
            } catch (err) {
                console.error("Error al cargar cabaña:", err);
                setError(
                    err.message ||
                    'Error al cargar los detalles de la cabaña'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCabana();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Cargando detalles de la cabaña..." />;
    }

    if (error) {
        return (
            <ErrorMessage 
                message={error}
                actionText="Volver a Cabañas"
                actionLink="/cabanas"
            />
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
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Servicios incluidos:</strong>
                            <span>{cabana.servicios?.join(', ') || 'No especificado'}</span>
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