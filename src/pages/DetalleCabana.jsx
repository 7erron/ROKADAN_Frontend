import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const api = axios.create({
    baseURL: 'https://rokadan-backend.onrender.com/api',
    timeout: 10000,
});

function DetalleCabana() {
    const { id } = useParams();
    const [cabana, setCabana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabana = async () => {
            try {
                const response = await api.get(`/cabanas/${id}`);
                console.log('Respuesta detalle cabaña:', response.data); // Para diagnóstico

                // Manejo adecuado de la respuesta según la estructura
                let cabanaData = {};
                
                // Verificar si la respuesta tiene los datos correctos
                if (response.data && response.data.cabanas && response.data.cabanas.length > 0) {
                    cabanaData = response.data.cabanas[0]; // Asumimos que hay solo una cabaña por id
                } else {
                    throw new Error("Datos de cabaña no válidos");
                }
                
                setCabana({
                    id: cabanaData.id,
                    nombre: cabanaData.nombre || 'Sin nombre',
                    descripcion: cabanaData.descripcion || 'Sin descripción',
                    precio: cabanaData.precio || 0,
                    capacidad: cabanaData.capacidad || 0,
                    imagen: cabanaData.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible',
                    destacada: cabanaData.destacada || false
                });
            } catch (err) {
                console.error("Error fetching cabin details:", err);
                setError("Error al cargar los detalles de la cabaña");
            } finally {
                setLoading(false);
            }
        };

        fetchCabana();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Cargando detalles..." />;
    }

    if (error) {
        return <ErrorMessage message={error} actionText="Volver a cabañas" actionLink="/cabanas" />;
    }

    if (!cabana) {
        return <ErrorMessage message="Cabaña no encontrada" actionText="Volver a cabañas" actionLink="/cabanas" />;
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={cabana.imagen}
                        alt={cabana.nombre}
                        className="img-fluid rounded shadow"
                        style={{ height: "400px", width: "100%", objectFit: "cover" }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-success mb-3">{cabana.nombre}</h1>
                    <p className="lead">{cabana.descripcion}</p>
                    <ul className="list-group mb-4">
                        <li className="list-group-item">
                            <strong>Precio:</strong> ${cabana.precio.toLocaleString()} por noche
                        </li>
                        <li className="list-group-item">
                            <strong>Capacidad:</strong> {cabana.capacidad} personas
                        </li>
                        {cabana.destacada && (
                            <li className="list-group-item text-warning">
                                <strong>⭐ Cabaña destacada</strong>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex gap-3">
                        <Link to={`/reservas/${cabana.id}`} className="btn btn-success">
                            Reservar
                        </Link>
                        <Link to="/cabanas" className="btn btn-outline-secondary">
                            Volver a Cabañas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleCabana;