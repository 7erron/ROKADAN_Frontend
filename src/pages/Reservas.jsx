import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createReserva } from '../api';

function Reservas() {
    const { id } = useParams();
    const { user, isAuthenticated } = useContext(AuthContext);
    const [reservationData, setReservationData] = useState({
        cabana: id || '',
        checkin: '',
        checkout: '',
        adults: 1,
        children: 0,
        extras: [],
        userId: user?.id || null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const serviciosExtras = [
        { id: 1, nombre: "Desayuno Incluido", precio: 5000 },
        { id: 2, nombre: "WiFi Gratis", precio: 0 },
        { id: 3, nombre: "Piscina", precio: 10000 },
        { id: 4, nombre: "Chimenea", precio: 8000 },
        { id: 5, nombre: "Excursiones", precio: 15000 },
        { id: 6, nombre: "Parking Gratuito", precio: 0 },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData({ ...reservationData, [name]: value });
    };

    const handleExtrasChange = (e) => {
        const { value, checked } = e.target;
        const extra = serviciosExtras.find((servicio) => servicio.id === parseInt(value));
        if (checked) {
            setReservationData({
                ...reservationData,
                extras: [...reservationData.extras, extra],
            });
        } else {
            setReservationData({
                ...reservationData,
                extras: reservationData.extras.filter((item) => item.id !== extra.id),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para realizar una reserva.');
            setLoading(false);
            return;
        }

        if (new Date(reservationData.checkin) >= new Date(reservationData.checkout)) {
            setError('La fecha de salida debe ser posterior a la fecha de llegada.');
            setLoading(false);
            return;
        }

        try {
            await createReserva({
                ...reservationData,
                userId: user.id
            });

            alert(`Reserva realizada con éxito para ${user.nombre}.`);
            setReservationData({
                cabana: '',
                checkin: '',
                checkout: '',
                adults: 1,
                children: 0,
                extras: [],
                userId: user.id
            });
        } catch (err) {
            console.error('Error al crear reserva:', err);
            setError(
                err.message ||
                'Error al realizar la reserva. Por favor intente nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container my-5">
            <h1 className="text-center text-success">Reservar Cabaña</h1>
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-3">
                        <label htmlFor="cabana" className="form-label">Cabaña</label>
                        <input
                            type="text"
                            id="cabana"
                            name="cabana"
                            className="form-control"
                            value={reservationData.cabana}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="checkin" className="form-label">Fecha de llegada</label>
                        <input
                            type="date"
                            id="checkin"
                            name="checkin"
                            className="form-control"
                            value={reservationData.checkin}
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
                            value={reservationData.checkout}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="adults" className="form-label">Cantidad de adultos</label>
                        <input
                            type="number"
                            id="adults"
                            name="adults"
                            className="form-control"
                            min="1"
                            value={reservationData.adults}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="children" className="form-label">Cantidad de niños</label>
                        <input
                            type="number"
                            id="children"
                            name="children"
                            className="form-control"
                            min="0"
                            value={reservationData.children}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Servicios Extras</label>
                        {serviciosExtras.map((servicio) => (
                            <div key={servicio.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`extra-${servicio.id}`}
                                    value={servicio.id}
                                    onChange={handleExtrasChange}
                                    checked={reservationData.extras.some(e => e.id === servicio.id)}
                                />
                                <label className="form-check-label" htmlFor={`extra-${servicio.id}`}>
                                    {servicio.nombre} - ${servicio.precio}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn btn-success">Confirmar Reserva</button>
                </form>
            ) : (
                <p className="text-center text-danger">Debes iniciar sesión para realizar una reserva.</p>
            )}
        </main>
    );
}

export default Reservas;