import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import CabanaCard from "../components/CabanaCard";

function Home() {
    const [destacados, setDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [destacadosError, setDestacadosError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/cabanas/destacadas', {
                    signal: abortController.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('La API no devolvió un array válido');
                }

                setDestacados(response.data);
                setDestacadosError(null);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    setDestacadosError(
                        error.response?.data?.error || 
                        'Error al cargar cabañas destacadas. Intente recargar la página.'
                    );
                    setDestacados([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, []);

    const handleSearchRooms = async (searchData) => {
        const { checkin, checkout, adults, children } = searchData;
        setLoading(true);
        setSearchPerformed(true);
        setSearchError(null);

        try {
            const params = {
                fechaInicio: checkin,
                fechaFin: checkout,
                adultos: adults || 1,
                ninos: children || 0
            };

            const response = await axios.get('http://localhost:3000/api/cabanas/disponibles', {
                params,
                validateStatus: (status) => status < 500
            });
            
            if (response.status === 400) {
                throw new Error(response.data.error || 'Datos de búsqueda inválidos');
            }

            if (!Array.isArray(response.data)) {
                throw new Error('La respuesta del servidor no es válida');
            }

            setAvailableRooms(response.data);
        } catch (error) {
            setSearchError(
                error.message || 
                error.response?.data?.error || 
                'Error al buscar cabañas disponibles'
            );
            setAvailableRooms([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header onSearch={handleSearchRooms} />
            <div className="container my-5">
                {searchPerformed ? (
                    <>
                        <h2 className="text-success text-center mb-4">
                            {availableRooms.length > 0 ? 
                                "Cabañas Disponibles" : 
                                "No se encontraron cabañas disponibles"}
                        </h2>
                        
                        {searchError && (
                            <div className="alert alert-danger text-center">
                                {searchError}
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
                                {availableRooms.map((room) => (
                                    <div className="col-md-4 mb-4" key={room.id}>
                                        <CabanaCard 
                                            id={room.id}
                                            nombre={room.nombre}
                                            descripcion={room.descripcion}
                                            precio={room.precio}
                                            capacidad={room.capacidad}
                                            imagen={room.imagen}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="text-center mt-4">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearchPerformed(false);
                                    setAvailableRooms([]);
                                    setSearchError(null);
                                }}
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="row mb-5">
                            <div className="col-md-12 text-center">
                                <h1 className="text-success">BIENVENIDOS A CABAÑAS ROKADAN</h1>
                                <p className="lead">
                                    El lugar perfecto para descansar y disfrutar de la naturaleza
                                </p>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-md-6">
                                <h2>Sobre Nosotros</h2>
                                <p>
                                    En el corazón de la naturaleza, donde el tiempo se detiene y la
                                    tranquilidad reina, se encuentra nuestro refugio: un conjunto de
                                    cabañas diseñadas para ofrecerte una experiencia inolvidable.
                                </p>
                                <Link to="/quienessomos" className="btn btn-outline-success">
                                    Conocer más
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <img
                                    src="https://www.complejoturisticopucon.com/wp-content/uploads/SeoGoogle_.jpg"
                                    alt="Cabañas Rokadan"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        <hr className="my-5" />

                        <div className="row">
                            <div className="col-md-12 text-center mb-4">
                                <h2>Cabañas Destacadas</h2>
                                {destacadosError && (
                                    <div className="alert alert-warning">
                                        {destacadosError}
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : destacados.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No hay cabañas destacadas disponibles
                            </div>
                        ) : (
                            <div className="row">
                                {destacados.map((cabana) => (
                                    <div className="col-md-6 mb-4" key={cabana.id}>
                                        <div className="card h-100">
                                            <img
                                                src={cabana.imagen || 'https://via.placeholder.com/400x300'}
                                                className="card-img-top"
                                                alt={cabana.nombre}
                                                style={{ height: "350px", objectFit: "cover" }}
                                            />
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{cabana.nombre}</h5>
                                                <p className="card-text">{cabana.descripcion}</p>
                                                <Link
                                                    to={`/cabanas/${cabana.id}`}
                                                    className="btn btn-success"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="row mt-4 text-center">
                            <div className="col-md-12">
                                <Link to="/cabanas" className="btn btn-primary">
                                    Ver todas las cabañas
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Home;