import React, { useState } from "react";
import '../assets/css/header.css';

const Header = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        checkin: "",
        checkout: "",
        adults: 1,
        children: 0,
    });
    const [localError, setLocalError] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Resetear error cuando cambian los datos
        if (localError) setLocalError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { checkin, checkout } = formData;

        // Validaciones locales
        if (!checkin || !checkout) {
            setLocalError("Por favor, seleccione las fechas de llegada y salida.");
            return;
        }

        if (new Date(checkin) >= new Date(checkout)) {
            setLocalError("La fecha de salida debe ser posterior a la fecha de llegada.");
            return;
        }

        setLocalError(null);
        setSearchLoading(true);
        
        try {
            await onSearch(formData);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            setLocalError("Ocurrió un error al procesar la búsqueda");
        } finally {
            setSearchLoading(false);
        }
    };

    // Obtener fecha mínima para checkout (día siguiente al checkin)
    const minCheckoutDate = formData.checkin 
        ? new Date(new Date(formData.checkin).getTime() + 86400000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    return (
        <header className="d-flex flex-column justify-content-center align-items-center" id="cabeceraFondo">
            <br />
            <h3 className="text-light text-center">EL LUGAR PERFECTO PARA DESCANSAR ES CON NOSOTROS</h3>
            <p className="text-light text-center">
                RESERVE SU CABAÑA
            </p>
            <div className="container">
                <hr className="custom-hr" />
                <div className="reservation-form p-4 bg-light rounded shadow">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="checkin" className="form-label">Fecha de llegada:</label>
                            <input
                                type="date"
                                id="checkin"
                                name="checkin"
                                className="form-control"
                                value={formData.checkin}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="checkout" className="form-label">Fecha de salida:</label>
                            <input
                                type="date"
                                id="checkout"
                                name="checkout"
                                className="form-control"
                                value={formData.checkout}
                                onChange={handleChange}
                                min={minCheckoutDate}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="adults" className="form-label">Cantidad de adultos:</label>
                            <select
                                id="adults"
                                name="adults"
                                className="form-select"
                                value={formData.adults}
                                onChange={handleChange}
                                required
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="children" className="form-label">Cantidad de niños:</label>
                            <select
                                id="children"
                                name="children"
                                className="form-select"
                                value={formData.children}
                                onChange={handleChange}
                            >
                                {[0, 1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        
                        {localError && (
                            <div className="col-12">
                                <div className="alert alert-danger mb-0">
                                    {localError}
                                </div>
                            </div>
                        )}
                        
                        <div className="col-12 text-center">
                            <button 
                                type="submit" 
                                className="btn btn-success"
                                disabled={searchLoading}
                            >
                                {searchLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Buscando...</span>
                                    </>
                                ) : "Buscar cabañas"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <br />
        </header>
    );
};

export default Header;