import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MisReservas() {
    const [reservas, setReservas] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editData, setEditData] = useState({
        checkin: '',
        checkout: '',
        adults: 1,
        children: 0,
    });

    useEffect(() => {
        // Simulación de obtención de reservas desde localStorage
        const storedReservas = JSON.parse(localStorage.getItem('reservas')) || [];
        setReservas(storedReservas);
    }, []);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setEditData({
            checkin: reservas[index].checkin,
            checkout: reservas[index].checkout,
            adults: reservas[index].adults,
            children: reservas[index].children,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = () => {
        if (new Date(editData.checkin) >= new Date(editData.checkout)) {
            alert('La fecha de salida debe ser posterior a la fecha de llegada.');
            return;
        }

        const updatedReservas = [...reservas];
        updatedReservas[editingIndex] = {
            ...updatedReservas[editingIndex],
            ...editData,
        };
        setReservas(updatedReservas);
        localStorage.setItem('reservas', JSON.stringify(updatedReservas));
        setEditingIndex(null);
        alert('Reserva actualizada con éxito.');
    };

    const handleCancel = () => {
        setEditingIndex(null);
    };

    const handlePrint = (reserva) => {
        const printContent = `
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h1>Comprobante de Reserva</h1>
                <h1>Muchas gracias por reservar junto a Cabañas Rokadan</h1>
                <h2>A continuación te entregamos el detalle de tu estadía</h2>
                <p><strong>Cabaña:</strong> ${reserva.cabana}</p>
                <p><strong>Fecha de llegada:</strong> ${reserva.checkin}</p>
                <p><strong>Fecha de salida:</strong> ${reserva.checkout}</p>
                <p><strong>Adultos:</strong> ${reserva.adults}</p>
                <p><strong>Niños:</strong> ${reserva.children}</p>
                <p><strong>Servicios Extras:</strong> ${Array.isArray(reserva.extras) && reserva.extras.length > 0 ? reserva.extras.map(extra => extra.nombre).join(', ') : 'Ninguno'}</p>
                <hr style="margin: 20px 0;" />
                <p>¡Gracias por reservar con nosotros!</p>
            </div>
        `;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
    };

    return (
        <main className="container my-5">
            <h1 className="text-center text-success">Mis Reservas</h1>
            {reservas.length === 0 ? (
                <div className="text-center">
                    <p>No tienes reservas confirmadas.</p>
                    <p>Para realizar una reserva, dirígete a la opción <strong>Cabañas</strong> y selecciona una.</p>
                </div>
            ) : (
                <div className="row">
                    {reservas.map((reserva, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                            <div className="card">
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
                                                    value={editData.adults}
                                                    onChange={handleChange}
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
                                                    value={editData.children}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <button className="btn btn-success me-2" onClick={handleSave}>
                                                Guardar
                                            </button>
                                            <button className="btn btn-secondary" onClick={handleCancel}>
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="card-title">Cabaña: {reserva.cabana}</h5>
                                            <p className="card-text">
                                                <strong>Fecha de llegada:</strong> {reserva.checkin}<br />
                                                <strong>Fecha de salida:</strong> {reserva.checkout}<br />
                                                <strong>Adultos:</strong> {reserva.adults}<br />
                                                <strong>Niños:</strong> {reserva.children}<br />
                                                <strong>Servicios Extras:</strong> {Array.isArray(reserva.extras) && reserva.extras.length > 0 ? reserva.extras.map(extra => extra.nombre).join(', ') : 'Ninguno'}
                                            </p>
                                            <button className="btn btn-primary me-2" onClick={() => handleEditClick(index)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-info" onClick={() => handlePrint(reserva)}>
                                                Imprimir Comprobante
                                            </button>
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
