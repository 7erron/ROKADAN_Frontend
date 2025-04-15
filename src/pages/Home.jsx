import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import CabanaCard from "../components/CabanaCard";
import { getCabanasDestacadas, getCabanasDisponibles } from "../api";
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
    const [destacados, setDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [destacadosError, setDestacadosError] = useState(null);

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const data = await getCabanasDestacadas();
                
                // Manejo de diferentes estructuras de respuesta
                const destacadosData = data.data?.cabanas || data.cabanas || data;
                
                setDestacados(destacadosData);
                setDestacadosError(null);
            } catch (err) {
                console.error("Error al cargar destacados:", err);
                setDestacadosError(
                    err.message ||
                    'Error al cargar cabañas destacadas. Intente recargar la página.'
                );
                setDestacados([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDestacados();
    }, []);

    const handleSearchRooms = async (searchData) => {
        setLoading(true);
        setSearchPerformed(true);
        setSearchError(null);

        try {
            const params = {
                fechaInicio: searchData.checkin,
                fechaFin: searchData.checkout,
                adultos: searchData.adults || 1,
                ninos: searchData.children || 0
            };

            const data = await getCabanasDisponibles(params);
            
            // Manejo de diferentes estructuras de respuesta
            const cabanasData = data.data?.cabanas || data.cabanas || data;
            
            setAvailableRooms(cabanasData);
        } catch (err) {
            console.error("Error al buscar cabañas:", err);
            setSearchError(
                err.message || 
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
                            <ErrorMessage message={searchError} />
                        )}

                        {loading ? (
                            <LoadingSpinner />
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
                                    <ErrorMessage message={destacadosError} />
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <LoadingSpinner />
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