import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminReservaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación de carga de datos
        setTimeout(() => {
            const reservas = [
                {
                    id: 1,
                    cabana: "Cabaña El Pinar",
                    usuario: "Juan Pérez",
                    email: "juan@example.com",
                    telefono: "912345678",
                    checkin: "2023-12-15",
                    checkout: "2023-12-20",
                    adultos: 2,
                    niños: 1,
                    estado: "confirmada",
                    total: 125000,
                    extras: [
                        { id: 1, nombre: "Desayuno Incluido", precio: 5000 },
                        { id: 3, nombre: "Piscina", precio: 10000 }
                    ],
                    fechaReserva: "2023-11-10T14:30:00Z"
                }
            ];
            const foundReserva = reservas.find(r => r.id === parseInt(id));
            setReserva(foundReserva);
            setLoading(false);
        }, 500);
    }, [id]);

    const cambiarEstado = (nuevoEstado) => {
        setReserva({ ...reserva, estado: nuevoEstado });
        // Aquí iría la lógica para actualizar en la API
        alert(`Estado cambiado a ${nuevoEstado}`);
    };

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!reserva) {
        return (
            <div className="container my-5 text-center">
                <h2>Reserva no encontrada</h2>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/admin/reservas')}
                >
                    Volver a Reservas
                </button>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success">Detalle de Reserva #{reserva.id}</h1>
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/reservas')}
                >
                    Volver
                </button>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Información de la Reserva</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Cabaña:</strong> {reserva.cabana}
                                </li>
                                <li className="list-group-item">
                                    <strong>Fechas:</strong> {reserva.checkin} a {reserva.checkout}
                                </li>
                                <li className="list-group-item">
                                    <strong>Huéspedes:</strong> {reserva.adultos} adultos, {reserva.niños} niños
                                </li>
                                <li className="list-group-item">
                                    <strong>Estado:</strong>
                                    <select
                                        className="form-select mt-2"
                                        value={reserva.estado}
                                        onChange={(e) => cambiarEstado(e.target.value)}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                </li>
                                <li className="list-group-item">
                                    <strong>Fecha de reserva:</strong> {new Date(reserva.fechaReserva).toLocaleString()}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Información del Cliente</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Nombre:</strong> {reserva.usuario}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email:</strong> {reserva.email}
                                </li>
                                <li className="list-group-item">
                                    <strong>Teléfono:</strong> {reserva.telefono}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Servicios Adicionales</h5>
                        </div>
                        <div className="card-body">
                            {reserva.extras && reserva.extras.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {reserva.extras.map((extra, index) => (
                                        <li key={index} className="list-group-item">
                                            {extra.nombre} - ${extra.precio}
                                        </li>
                                    ))}
                                    <li className="list-group-item fw-bold">
                                        Total: ${reserva.total}
                                    </li>
                                </ul>
                            ) : (
                                <p>No se han agregado servicios adicionales.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReservaDetalle;