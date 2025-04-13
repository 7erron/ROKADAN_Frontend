import React from 'react';

function Pago() {
    return (
        <div className="container my-5">
            <h1 className="text-center text-success mb-4">Pagar Reserva</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <p className="lead text-center">Aquí puedes completar el pago de tu reserva.</p>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="cardNumber" className="form-label">Número de tarjeta</label>
                                    <input type="text" className="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="expiryDate" className="form-label">Fecha de expiración</label>
                                        <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input type="text" className="form-control" id="cvv" placeholder="123" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cardName" className="form-label">Nombre en la tarjeta</label>
                                    <input type="text" className="form-control" id="cardName" placeholder="John Doe" />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success">Realizar Pago</button>
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