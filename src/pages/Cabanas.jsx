import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CabanaCard from '../components/CabanaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
// Configuración de Axios para el backend
const api = axios.create({
  baseURL: 'https://rokadan-backend.onrender.com/api',
  timeout: 10000, // 10 segundos de timeout
});

function Cabanas() {
    const [cabanas, setCabanas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabanas = async () => {
            try {
                const response = await axios.get('https://rokadan-backend.onrender.com/api/cabanas');
                console.log('Respuesta del backend:', response.data); // Para diagnóstico
                
                // Manejo mejorado de la respuesta
                let cabanasData = [];
                
                if (response.data && Array.isArray(response.data)) {
                    cabanasData = response.data;
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    cabanasData = response.data.data;
                }
                
                setCabanas(cabanasData);
                
                if (cabanasData.length === 0) {
                    setError("No se encontraron cabañas");
                }
                
            } catch (err) {
                console.error("Error fetching cabins:", err);
                setError("Error al cargar las cabañas. Por favor, intente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchCabanas();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Cargando cabañas..." />;
    }

    if (error) {
        return <ErrorMessage message={error} actionText="Volver al inicio" actionLink="/" />;
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Nuestras Cabañas</h1>
            <div className="row">
                {cabanas.map(cabana => (
                    <div className="col-md-4 mb-4" key={cabana.id}>
                        <CabanaCard 
                            id={cabana.id}
                            nombre={cabana.nombre}
                            descripcion={cabana.descripcion}
                            precio={cabana.precio}
                            capacidad={cabana.capacidad}
                            imagen={cabana.imagen}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cabanas;