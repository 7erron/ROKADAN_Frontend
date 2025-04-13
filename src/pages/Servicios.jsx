import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicioCard from '../components/ServicioCard';
import { AuthContext } from '../context/AuthContext';

function Servicios() {
    const [cart, setCart] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Cargar carrito desde localStorage si existe
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('serviciosCart')) || [];
        setCart(storedCart);
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('serviciosCart', JSON.stringify(cart));
    }, [cart]);

    const servicios = [
        {
            id: 1,
            titulo: "Desayuno Incluido",
            descripcion: "Disfruta de un desayuno completo con productos locales y caseros.",
            icono: "bi-cup-hot",
            precio: 5000
        },
        {
            id: 2,
            titulo: "WiFi Gratis",
            descripcion: "Mantente conectado con conexión WiFi de alta velocidad en todas nuestras cabañas.",
            icono: "bi-wifi",
            precio: 0
        },
        {
            id: 3,
            titulo: "Piscina",
            descripcion: "Relájate en nuestra piscina con vistas panorámicas al bosque.",
            icono: "bi-water",
            precio: 10000
        },
        {
            id: 4,
            titulo: "Chimenea",
            descripcion: "Todas nuestras cabañas cuentan con chimenea para las noches frías.",
            icono: "bi-fire",
            precio: 8000
        },
        {
            id: 5,
            titulo: "Excursiones",
            descripcion: "Organizamos excursiones guiadas por los alrededores.",
            icono: "bi-map",
            precio: 15000
        },
        {
            id: 6,
            titulo: "Parking Gratuito",
            descripcion: "Aparcamiento privado gratuito en el alojamiento.",
            icono: "bi-p-square",
            precio: 0
        }
    ];

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

    const addServicesToReservation = () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para agregar servicios a tu reserva.");
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            alert("No hay servicios en el carrito para agregar.");
            return;
        }

        // Obtener reservas existentes
        const storedReservas = JSON.parse(localStorage.getItem('reservas')) || [];
        
        // Buscar reservas del usuario actual
        const userReservas = storedReservas.filter(reserva => 
            reserva.userId === user.id
        );
        
        if (userReservas.length === 0) {
            alert("No tienes ninguna reserva activa. Primero debes crear una reserva.");
            navigate('/cabañas');
            return;
        }

        // Tomar la última reserva del usuario
        const lastReserva = userReservas[userReservas.length - 1];
        
        // Actualizar los extras de la reserva
        const updatedReservas = storedReservas.map(reserva => 
            reserva.id === lastReserva.id 
                ? { ...reserva, extras: cart } 
                : reserva
        );
        
        // Guardar de vuelta en localStorage
        localStorage.setItem('reservas', JSON.stringify(updatedReservas));
        
        // Limpiar el carrito
        setCart([]);
        
        alert("Servicios agregados exitosamente a tu reserva.");
        navigate('/misreservas');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.precio * item.dias);
        }, 0);
    };

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
                        <div className="col-md-4" key={servicio.id}>
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