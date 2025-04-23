import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

function Reservas() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);

    const [cabanas, setCabanas] = useState([]);
    const [serviciosExtras, setServiciosExtras] = useState([]);
    const [reservationData, setReservationData] = useState({
        cabana: '',
        checkin: '',
        checkout: '',
        adults: 1,
        children: 0,
        extras: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cabanaRes, serviciosRes] = await Promise.all([
                    api.get('/cabanas'),
                    api.get('/servicios')
                ]);
                setCabanas(cabanaRes.data);
                setServiciosExtras(serviciosRes.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
                setError("Error al cargar cabañas o servicios");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData(prev => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (e, extra) => {
        const isChecked = e.target.checked;
        setReservationData(prev => {
            const extras = isChecked
                ? [...prev.extras, extra]
                : prev.extras.filter(item => item.id !== extra.id);
            return { ...prev, extras };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert('Debes iniciar sesión para realizar una reserva.');
            navigate('/login');
            return;
        }

        if (new Date(reservationData.checkin) >= new Date(reservationData.checkout)) {
            alert('La fecha de salida debe ser posterior a la fecha de llegada.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const serviciosSeleccionados = reservationData.extras.map(extra => extra.id);

            const response = await api.post('/reservas', {
                cabana_id: reservationData.cabana,
                fecha_inicio: reservationData.checkin,
                fecha_fin: reservationData.checkout,
                adultos: reservationData.adults,
                ninos: reservationData.children,
                servicios: serviciosSeleccionados
            });

            alert(`Reserva realizada con éxito para ${user.nombre}.`);
            navigate('/misreservas');
        } catch (err) {
            console.error("Error al crear reserva:", err);
            setError(err.response?.data?.message || 'Error al crear la reserva.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Reservar Cabaña</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Cabaña</label>
                    <select
                        name="cabana"
                        value={reservationData.cabana}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Seleccione una cabaña</option>
                        {cabanas.map(cabana => (
                            <option key={cabana.id} value={cabana.id}>{cabana.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Check-in</label>
                    <input
                        type="date"
                        name="checkin"
                        value={reservationData.checkin}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Check-out</label>
                    <input
                        type="date"
                        name="checkout"
                        value={reservationData.checkout}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Adultos</label>
                    <input
                        type="number"
                        name="adults"
                        value={reservationData.adults}
                        onChange={handleChange}
                        className="form-control"
                        min="1"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Niños</label>
                    <input
                        type="number"
                        name="children"
                        value={reservationData.children}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                    />
                </div>
                <div className="mb-3">
                    <label>Servicios adicionales</label>
                    {serviciosExtras.map(extra => (
                        <div key={extra.id} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`extra-${extra.id}`}
                                checked={reservationData.extras.some(item => item.id === extra.id)}
                                onChange={(e) => handleExtraChange(e, extra)}
                            />
                            <label className="form-check-label" htmlFor={`extra-${extra.id}`}>
                                {extra.nombre} (${extra.precio})
                            </label>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Reservando...' : 'Reservar'}
                </button>
            </form>
        </div>
    );
}

export default Reservas;
