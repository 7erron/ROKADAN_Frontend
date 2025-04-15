import React, { useState, useEffect } from 'react';
import CabanaCard from '../components/CabanaCard';
import axios from 'axios';

// Configuración de Axios para el backend
const api = axios.create({
  baseURL: 'https://rokadan-backend.onrender.com/api',
  timeout: 10000, // 10 segundos de timeout
});

function Cabañas() {
    const [cabanas, setCabanas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchCabanas = async () => {
            try {
                const data = await getCabanas();
                // Manejar diferentes formatos de respuesta
                const cabanasData = data.data?.cabanas || data.cabanas || data;
                setCabanas(cabanasData);
                setError(null);
            } catch (err) {
                console.error('Error al obtener cabañas:', err);
                setError(err.message || 'Error al cargar las cabañas');
                setCabanas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCabanas();
    }, []);

    return (
        <main>
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h1 className="text-success">CABAÑAS</h1>
                        <p>REVISE NUESTRAS CABAÑAS DISPONIBLES.</p>
                    </div>
                </div>
                
                {error && (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                )}
                
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {cabanas.map(cabana => (
                            <div className="col-md-4" key={cabana.id}>
                                <CabanaCard {...cabana} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cabañas;