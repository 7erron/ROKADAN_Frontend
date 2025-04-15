import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rokadan-backend.onrender.com/api',
  timeout: 10000,
});

function Pago() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        reservaId: id
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Debes iniciar sesión para realizar un pago.');
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Validación básica de tarjeta (simulada)
            if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Procesar pago en el backend
            const response = await api.post('/pagos', {
                ...paymentData,
                userId: user.id,
                reservaId: id
            });

            alert('Pago procesado exitosamente. Gracias por su reserva.');
            navigate('/misreservas');
        } catch (err) {
            console.error("Error al procesar pago:", err);
            setError(err.response?.data?.message || err.message || 'Error al procesar el pago. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center text-success mb-4">Pagar Reserva</h1>
            {error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <p className="lead text-center">Completa los datos para procesar el pago de tu reserva.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="cardNumber" className="form-label">Número de tarjeta</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="cardNumber" 
                                        name="cardNumber" 
                                        value={paymentData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012 3456" 
                                        required
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="expiryDate" className="form-label">Fecha de expiración</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="expiryDate" 
                                            name="expiryDate" 
                                            value={paymentData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY" 
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="cvv" 
                                            name="cvv" 
                                            value={paymentData.cvv}
                                            onChange={handleChange}
                                            placeholder="123" 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cardName" className="form-label">Nombre en la tarjeta</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="cardName" 
                                        name="cardName" 
                                        value={paymentData.cardName}
                                        onChange={handleChange}
                                        placeholder="John Doe" 
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? 'Procesando...' : 'Realizar Pago'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pago;