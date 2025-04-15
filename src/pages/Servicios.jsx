import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioCard from '../components/ServicioCard';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rokadan-backend.onrender.com/api',
  timeout: 10000,
});

function Servicios() {
    const [cart, setCart] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Cargar servicios desde la API
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await api.get('/servicios');
                setServicios(response.data?.servicios || response.data || response);
            } catch (err) {
                console.error("Error al cargar servicios:", err);
                setServicios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();

        // Cargar carrito desde localStorage si existe
        const storedCart = JSON.parse(localStorage.getItem('serviciosCart')) || [];
        setCart(storedCart);
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('serviciosCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (servicio) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para agregar servicios al carrito.");
            navigate('/login');
            return;
        }

        const existingItem = cart.find(item => item.id === servicio.id);
        if (existingItem) {
            alert(`${servicio.titulo} ya está en el carrito.`);
        } else {
            const updatedCart = [...cart, { ...servicio, dias: 1 }];
            setCart(updatedCart);
            alert(`${servicio.titulo} ha sido agregado al carrito.`);
        }
    };

    const updateDays = (id, dias) => {
        const updatedCart = cart.map(item => 
            item.id === id ? { ...item, dias: dias > 0 ? dias : 1 } : item
        );
        setCart(updatedCart);
    };

    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        alert("El servicio ha sido eliminado del carrito.");
    };

    const addServicesToReservation = async () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para agregar servicios a tu reserva.");
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            alert("No hay servicios en el carrito para agregar.");
            return;
        }

        try {
            // Obtener la última reserva del usuario
            const response = await api.get(`/reservas/usuario/${user.id}`);
            const reservas = response.data?.reservas || response.data || response;
            
            if (reservas.length === 0) {
                alert("No tienes ninguna reserva activa. Primero debes crear una reserva.");
                navigate('/cabañas');
                return;
            }

            // Tomar la última reserva
            const lastReserva = reservas[reservas.length - 1];
            
            // Actualizar la reserva con los servicios
            await api.put(`/reservas/${lastReserva.id}`, {
                extras: cart
            });
            
            // Limpiar el carrito
            setCart([]);
            
            alert("Servicios agregados exitosamente a tu reserva.");
            navigate('/misreservas');
        } catch (err) {
            console.error("Error al agregar servicios a la reserva:", err);
            alert(err.response?.data?.message || "Error al agregar servicios a la reserva.");
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.precio * item.dias);
        }, 0);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <main>
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h1 className="text-success">SERVICIOS</h1>
                        <p>REVISE NUESTROS SERVICIOS DISPONIBLES.</p>
                        <p>Puedes añadir un servicio directamente a tu reserva</p>
                    </div>
                </div>
                <div className="row">
                    {servicios.map(servicio => (
                        <div className="col-md-4 mb-4" key={servicio.id}>
                            <ServicioCard 
                                {...servicio} 
                                onAddToCart={() => addToCart(servicio)} 
                            />
                        </div>
                    ))}
                </div>
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h2 className="mb-0">Carrito de Servicios</h2>
                            </div>
                            <div className="card-body">
                                {cart.length === 0 ? (
                                    <p>No hay servicios en el carrito.</p>
                                ) : (
                                    <>
                                        <ul className="list-group mb-4">
                                            {cart.map((item, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className={`bi ${item.icono} me-2`}></i>
                                                        {item.titulo} - {item.dias} día(s) - ${item.precio * item.dias}
                                                    </div>
                                                    <div>
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary me-2"
                                                            onClick={() => updateDays(item.id, item.dias - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary me-2"
                                                            onClick={() => updateDays(item.id, item.dias + 1)}
                                                        >
                                                            +
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5>Total: ${calculateTotal()}</h5>
                                            <button 
                                                className="btn btn-success"
                                                onClick={addServicesToReservation}
                                            >
                                                Agregar a mi reserva
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Servicios;