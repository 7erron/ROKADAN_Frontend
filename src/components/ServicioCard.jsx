import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function ServicioCard({ servicio, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart(servicio); // Pasar el servicio completo al carrito

    toast.success(`${servicio.titulo} agregado al carrito`, {
      position: "top-right",
      autoClose: 2000
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <motion.div
      className="card h-100 shadow-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-body text-center d-flex flex-column justify-content-between">
        <div>
          <i className={`bi ${servicio.icono || 'bi-star'} fs-1 mb-3 text-success`}></i>
          <h5 className="card-title">{servicio.titulo || 'Servicio'}</h5>
          <p className="card-text">{servicio.descripcion || 'Descripción no disponible.'}</p>
        </div>
        <motion.button
          className="btn btn-outline-success mt-3"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleAdd}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Agregando...
            </>
          ) : (
            'Agregar al Carrito'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

ServicioCard.propTypes = {
  servicio: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    icono: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ServicioCard;
