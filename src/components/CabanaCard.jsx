import React from 'react';
import { Link } from 'react-router-dom';

function CabanaCard({
  id = '',
  nombre = 'Sin nombre',
  descripcion = 'Sin descripción',
  precio = 0,
  imagen = '',
  capacidad = 0
}) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={imagen || 'https://via.placeholder.com/400x200?text=Sin+imagen'}
        className="card-img-top"
        alt={nombre}
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x200?text=Sin+imagen';
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">
          {descripcion.length > 100 ? `${descripcion.slice(0, 100)}...` : descripcion}
        </p>
        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item">Precio: ${precio}/noche</li>
          <li className="list-group-item">Capacidad: {capacidad} personas</li>
        </ul>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/cabanas/${id}`} className="btn btn-primary w-50">Ver detalles</Link>
          <Link to={`/reservas/${id}`} className="btn btn-success w-50">Reservar</Link>
        </div>
      </div>
    </div>
  );
}

export default CabanaCard;
