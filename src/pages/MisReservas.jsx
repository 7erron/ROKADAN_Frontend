import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const api = axios.create({
  baseURL: 'https://rokadan-backend.onrender.com/api',
  timeout: 10000,
});

function MisReservas() {
    const { user } = useContext(AuthContext);
    const [reservas, setReservas] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editData, setEditData] = useState({
        checkin: '',
        checkout: '',
        adults: 1,
        children: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        const fetchReservas = async () => {
            if (!user?.id) {
                setError('Debes iniciar sesión para ver tus reservas');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/reservas/usuario/${user.id}`);
                
                // Manejo de diferentes estructuras de respuesta
                const reservasData = response.data?.reservas || 
                                   response.data || 
                                   response;
                
                setReservas(reservasData);
                setError(null);
            } catch (err) {
                console.error("Error al obtener reservas:", err);
                setError(err.response?.data?.message || 'Error al cargar tus reservas');
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [user]);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setEditData({
            checkin: reservas[index].checkin,
            checkout: reservas[index].checkout,
            adults: reservas[index].adults,
            children: reservas[index].children,
        });
        setUpdateError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async () => {
        if (new Date(editData.checkin) >= new Date(editData.checkout)) {
            setUpdateError('La fecha de salida debe ser posterior a la fecha de llegada.');
            return;
        }

        try {
            const response = await api.put(
                `/reservas/${reservas[editingIndex].id}`, 
                editData
            );
            
            const updatedReserva = response.data?.reserva || response.data;
            
            const updatedReservas = [...reservas];
            updatedReservas[editingIndex] = updatedReserva;
            
            setReservas(updatedReservas);
            setEditingIndex(null);
            setUpdateError(null);
        } catch (err) {
            console.error("Error al actualizar reserva:", err);
            setUpdateError(err.response?.data?.message || 'Error al actualizar la reserva. Por favor intente nuevamente.');
        }
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setUpdateError(null);
    };

    const handlePrint = (reserva) => {
        const printContent = `
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h1>Comprobante de Reserva</h1>
                <h2>Muchas gracias por reservar junto a Cabañas Rokadan</h2>
                <h3>A continuación te entregamos el detalle de tu estadía</h3>
                <p><strong>Cabaña:</strong> ${reserva.cabana?.nombre || reserva.cabanaId || 'No especificado'}</p>
                <p><strong>Fecha de llegada:</strong> ${reserva.checkin}</p>
                <p><strong>Fecha de salida:</strong> ${reserva.checkout}</p>
                <p><strong>Adultos:</strong> ${reserva.adults}</p>
                <p><strong>Niños:</strong> ${reserva.children}</p>
                <p><strong>Servicios Extras:</strong> ${reserva.extras?.map(e => e.nombre).join(', ') || 'Ninguno'}</p>
                <hr style="margin: 20px 0;" />
                <p>¡Gracias por reservar con nosotros!</p>
            </div>
        `;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
    };

    if (loading) {
        return <LoadingSpinner message="Cargando tus reservas..." />;
    }

    if (error) {
        return (
            <ErrorMessage 
                message={error}
                actionText={user ? "Recargar" : "Iniciar sesión"}
                actionLink={user ? window.location.pathname : "/login"}
            />
        );
    }

    return (
        <main className="container my-5">
            <h1 className="text-center text-success">Mis Reservas</h1>
            
            {updateError && (
                <div className="alert alert-danger text-center">
                    {updateError}
                </div>
            )}

            {reservas.length === 0 ? (
                <div className="text-center">
                    <p>No tienes reservas confirmadas.</p>
                    <p>Para realizar una reserva, dirígete a la opción <strong>Cabañas</strong> y selecciona una.</p>
                    <Link to="/cabanas" className="btn btn-primary mt-3">
                        Ver Cabañas
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {reservas.map((reserva, index) => (
                        <div className="col-md-6 mb-4" key={reserva.id || index}>
                            <div className="card h-100">
                                <div className="card-body">
                                    {editingIndex === index ? (
                                        <>
                                            <h5 className="card-title">Editar Reserva</h5>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="checkin" className="form-label">Fecha de llegada</label>
                                                <input
                                                    type="date"
                                                    id="checkin"
                                                    name="checkin"
                                                    className="form-control"
                                                    value={editData.checkin}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="checkout" className="form-label">Fecha de salida</label>
                                                <input
                                                    type="date"
                                                    id="checkout"
                                                    name="checkout"
                                                    className="form-control"
                                                    value={editData.checkout}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="adults" className="form-label">Adultos</label>
                                                <input
                                                    type="number"
                                                    id="adults"
                                                    name="adults"
                                                    className="form-control"
                                                    min="1"
                                                    value={editData.adults}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="children" className="form-label">Niños</label>
                                                <input
                                                    type="number"
                                                    id="children"
                                                    name="children"
                                                    className="form-control"
                                                    min="0"
                                                    value={editData.children}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-success"
                                                    onClick={handleSave}
                                                >
                                                    Guardar Cambios
                                                </button>
                                                <button 
                                                    className="btn btn-secondary"
                                                    onClick={handleCancel}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="card-title">
                                                Reserva #{reserva.id || index + 1} - {reserva.cabana?.nombre || 'Cabaña no especificada'}
                                            </h5>
                                            
                                            <div className="mb-3">
                                                <p><strong>Estado:</strong> {reserva.estado || 'Confirmada'}</p>
                                                <p><strong>Fecha de llegada:</strong> {reserva.checkin}</p>
                                                <p><strong>Fecha de salida:</strong> {reserva.checkout}</p>
                                                <p><strong>Adultos:</strong> {reserva.adults}</p>
                                                <p><strong>Niños:</strong> {reserva.children}</p>
                                                <p><strong>Servicios Extras:</strong> {reserva.extras?.map(e => e.nombre).join(', ') || 'Ninguno'}</p>
                                                <p><strong>Total:</strong> ${reserva.total?.toLocaleString('es-CL') || 'No especificado'}</p>
                                            </div>
                                            
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => handleEditClick(index)}
                                                >
                                                    Modificar
                                                </button>
                                                <button 
                                                    className="btn btn-info"
                                                    onClick={() => handlePrint(reserva)}
                                                >
                                                    Imprimir
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default MisReservas;