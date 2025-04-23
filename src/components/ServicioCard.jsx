import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function ServicioCard({ servicio, onToggleServicio, seleccionado }) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = () => {
    setIsToggling(true);
    onToggleServicio(servicio.id); // Solo se necesita el ID para enviar al backend

    toast.success(`${servicio.nombre} ${seleccionado ? 'removido del' : 'agregado al'} carrito`, {
      position: 'top-right',
      autoClose: 2000,
    });

    setTimeout(() => {
      setIsToggling(false);
    }, 500);
  };

  return (
    <motion.div
      className={`card h-100 shadow-sm ${seleccionado ? 'border-success' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-body text-center d-flex flex-column justify-content-between">
        <div>
          <i className={`bi ${servicio.icono || 'bi-star'} fs-1 mb-3 text-success`}></i>
          <h5 className="card-title">{servicio.nombre || 'Servicio'}</h5>
          <p className="card-text">{servicio.descripcion || 'Descripción no disponible.'}</p>
          <p className="fw-bold">Precio: ${servicio.precio}</p>
        </div>
        <motion.button
          className={`btn ${seleccionado ? 'btn-danger' : 'btn-outline-success'} mt-3`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleToggle}
          disabled={isToggling}
        >
          {isToggling ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {seleccionado ? 'Removiendo...' : 'Agregando...'}
            </>
          ) : (
            seleccionado ? 'Remover del carrito' : 'Agregar al carrito'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

ServicioCard.propTypes = {
  servicio: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    icono: PropTypes.string,
    precio: PropTypes.number.isRequired
  }).isRequired,
  onToggleServicio: PropTypes.func.isRequired,
  seleccionado: PropTypes.bool.isRequired
};

export default ServicioCard;
