import React from 'react';

function LoadingSpinner({ message = "Cargando..." }) {
    return (
        <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">{message}</p>
        </div>
    );
}

export default LoadingSpinner;