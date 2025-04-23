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

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await api.get('/servicios');
        const data = response.data?.servicios || response.data || [];
        setServicios(data);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        alert("Hubo un error al cargar los servicios.");
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();

    const storedCart = JSON.parse(localStorage.getItem('serviciosCart')) || [];
    setCart(storedCart);
  }, []);

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
      const response = await api.get(`/reservas/usuario/${user.id}`);
      const reservas = response.data?.reservas || [];

      if (!Array.isArray(reservas) || reservas.length === 0) {
        alert("No tienes ninguna reserva activa. Primero debes crear una reserva.");
        navigate('/cabañas');
        return;
      }

      const lastReserva = reservas[reservas.length - 1];

      await api.put(`/reservas/${lastReserva.id}`, {
        extras: cart.map(item => ({ id: item.id, dias: item.dias }))
      });

      setCart([]);
      alert("Servicios agregados exitosamente a tu reserva.");
      navigate('/misreservas');

    } catch (err) {
      console.error("Error al agregar servicios a la reserva:", err);
      alert(err.response?.data?.message || "Error al agregar servicios a la reserva.");
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.dias), 0);
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

        <div className="row mt-4">
          <div className="col-md-12">
            <h3>Carrito de Servicios</h3>
            {cart.length === 0 ? (
              <p>No tienes servicios en el carrito.</p>
            ) : (
              <div>
                <ul className="list-group">
                  {cart.map(item => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                      <span>{item.titulo} ({item.dias} días) - ${item.precio * item.dias}</span>
                      <div>
                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                          Eliminar
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.dias}
                          onChange={(e) => updateDays(item.id, parseInt(e.target.value))}
                          className="form-control d-inline w-auto mx-2"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <strong>Total: ${calculateTotal()}</strong>
                </div>
                <button className="btn btn-success mt-3" onClick={addServicesToReservation}>
                  Agregar a Reserva
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Servicios;
