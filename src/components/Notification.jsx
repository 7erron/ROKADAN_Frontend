import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

function Notification({ message, type = 'success', onClose }) {
  const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
  
  return (
    <div className={`fixed-top d-flex justify-content-center mt-3`}>
      <div 
        className={`${bgColor} text-white p-3 rounded shadow d-flex align-items-center`}
        style={{ zIndex: 1000, minWidth: '300px' }}
      >
        <FaCheckCircle className="me-2" size={24} />
        <span className="flex-grow-1">{message}</span>
        <button 
          onClick={onClose}
          className="btn btn-sm btn-light ms-3"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default Notification;