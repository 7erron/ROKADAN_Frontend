import React from 'react';
import { Link } from 'react-router-dom';

function CabanaCard({ id, nombre, descripcion, precio, imagen, capacidad }) {
    return (
        <div className="card mb-4">
            <img src={imagen} className="card-img-top" alt={nombre} style={{ height: "200px", objectFit: "cover" }} />
            <div className="card-body">
                <h5 className="card-title">{nombre}</h5>
                <p className="card-text">{descripcion}</p>
                <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item">Precio: ${precio}/noche</li>
                    <li className="list-group-item">Capacidad: {capacidad} personas</li>
                </ul>
                <div className="d-flex gap-2">
                    <Link to={`/cabanas/${id}`} className="btn btn-primary">Ver detalles</Link>
                    <Link to={`/reservas/${id}`} className="btn btn-success">Reservar</Link>
                </div>
            </div>
        </div>
    );
}

export default CabanaCard;