import React from 'react';

function ServicioCard({ titulo, descripcion, icono, onAddToCart }) {
    return (
        <div className="card mb-4">
            <div className="card-body text-center">
                <i className={`bi ${icono} fs-1 mb-3 text-success`}></i>
                <h5 className="card-title">{titulo}</h5>
                <p className="card-text">{descripcion}</p>
                <button 
                    className="btn btn-outline-success"
                    onClick={onAddToCart}
                >
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
}

export default ServicioCard;