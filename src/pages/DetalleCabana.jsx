import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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
                const response = await axios.get(`https://rokadan-backend.onrender.com/api/cabanas/${id}`);
                const data = response.data.data?.cabana || response.data.cabana || response.data;
                setCabana(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching cabin details:", err);
                setError("Error al cargar los detalles de la cabaña");
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
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5 text-center">
                <div className="alert alert-danger">{error}</div>
                <Link to="/cabanas" className="btn btn-primary mt-3">Volver a Cabañas</Link>
            </div>
        );
    }

    if (!cabana) {
        return (
            <div className="container my-5 text-center">
                <h2>Cabaña no encontrada</h2>
                <Link to="/cabanas" className="btn btn-primary mt-3">Volver a Cabañas</Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6">
                    <img 
                        src={cabana.imagen} 
                        alt={cabana.nombre} 
                        className="img-fluid rounded shadow"
                        style={{height: "400px", width: "100%", objectFit: "cover"}}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-success mb-3">{cabana.nombre}</h1>
                    <p className="lead">{cabana.descripcion}</p>
                    <ul className="list-group mb-4">
                        <li className="list-group-item">
                            <strong>Precio:</strong> ${cabana.precio?.toLocaleString() || '0'} por noche
                        </li>
                        <li className="list-group-item">
                            <strong>Capacidad:</strong> {cabana.capacidad || 'No especificada'} personas
                        </li>
                    </ul>
                    <div className="d-flex gap-3">
                        <Link to={`/reservas/${cabana.id || cabana._id}`} className="btn btn-success">Reservar</Link>
                        <Link to="/cabanas" className="btn btn-outline-secondary">Volver a Cabañas</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleCabana;