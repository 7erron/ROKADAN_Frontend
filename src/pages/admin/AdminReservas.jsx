import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminReservas() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulación de obtención de datos
        setTimeout(() => {
            const data = [
                {
                    id: 1,
                    cabana: "Cabaña El Pinar",
                    usuario: "Juan Pérez",
                    checkin: "2023-12-15",
                    checkout: "2023-12-20",
                    adultos: 2,
                    niños: 1,
                    estado: "confirmada",
                    total: 125000
                },
                {
                    id: 2,
                    cabana: "Cabaña La Montaña",
                    usuario: "María González",
                    checkin: "2023-12-18",
                    checkout: "2023-12-22",
                    adultos: 4,
                    niños: 0,
                    estado: "pendiente",
                    total: 128000
                }
            ];
            setReservas(data);
            setLoading(false);
        }, 500);
    }, []);

    const filteredReservas = reservas.filter(reserva =>
        reserva.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.cabana.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cambiarEstado = (id, nuevoEstado) => {
        setReservas(reservas.map(reserva =>
            reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
        ));
    };

    return (
        <div className="container my-5">
            <h1 className="text-success mb-4">Administrar Reservas</h1>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por cliente o cabaña..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cabaña</th>
                                <th>Cliente</th>
                                <th>Fechas</th>
                                <th>Personas</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservas.map(reserva => (
                                <tr key={reserva.id}>
                                    <td>{reserva.id}</td>
                                    <td>{reserva.cabana}</td>
                                    <td>{reserva.usuario}</td>
                                    <td>
                                        {reserva.checkin} a {reserva.checkout}
                                    </td>
                                    <td>
                                        {reserva.adultos} adultos<br />
                                        {reserva.niños} niños
                                    </td>
                                    <td>${reserva.total}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={reserva.estado}
                                            onChange={(e) => cambiarEstado(reserva.id, e.target.value)}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="cancelada">Cancelada</option>
                                            <option value="completada">Completada</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Link 
                                            to={`/admin/reservas/${reserva.id}`}
                                            className="btn btn-sm btn-info"
                                        >
                                            <i className="bi bi-eye"></i> Detalle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminReservas;