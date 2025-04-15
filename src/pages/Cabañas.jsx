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
        let isMounted = true; // Para evitar actualizaciones en componentes desmontados
        
        const fetchCabanas = async (retryCount = 0) => {
            try {
                setLoading(true);
                const response = await api.get('/cabanas');
                
                if (isMounted) {
                    // Manejo flexible de la respuesta
                    const cabanasData = response.data?.cabanas || 
                                      response.data || 
                                      response;
                    
                    if (!cabanasData || cabanasData.length === 0) {
                        throw new Error('No se encontraron cabañas');
                    }
                    
                    setCabanas(cabanasData);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error al obtener cabañas:', err);
                    
                    // Manejo específico de errores
                    let errorMessage = 'Error al cargar las cabañas';
                    if (err.response) {
                        // Error de respuesta del servidor
                        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Error del servidor'}`;
                    } else if (err.request) {
                        // Error de conexión
                        errorMessage = 'No se pudo conectar al servidor';
                        
                        // Reintentar después de 2 segundos (máximo 3 intentos)
                        if (retryCount < 2) {
                            setTimeout(() => fetchCabanas(retryCount + 1), 2000);
                            return;
                        }
                    } else {
                        // Otros errores
                        errorMessage = err.message || errorMessage;
                    }
                    
                    setError(errorMessage);
                    setCabanas([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCabanas();

        return () => {
            isMounted = false; // Cleanup para evitar memory leaks
        };
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
                        <button 
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}
                
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando cabañas...</p>
                    </div>
                ) : (
                    <div className="row">
                        {cabanas.length > 0 ? (
                            cabanas.map(cabana => (
                                <div className="col-md-4 mb-4" key={cabana.id || cabana._id}>
                                    <CabanaCard {...cabana} />
                                </div>
                            ))
                        ) : (
                            !error && (
                                <div className="col-12 text-center py-5">
                                    <p>No hay cabañas disponibles en este momento.</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cabañas;