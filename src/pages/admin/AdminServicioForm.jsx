import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminServicioForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState({
        titulo: '',
        descripcion: '',
        icono: 'bi-check-circle',
        precio: '',
        activo: true
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            // Simulación de carga de datos
            setTimeout(() => {
                const servicios = [
                    {
                        id: 1,
                        titulo: "Desayuno Incluido",
                        descripcion: "Disfruta de un desayuno completo con productos locales y caseros.",
                        icono: "bi-cup-hot",
                        precio: 5000,
                        activo: true
                    }
                ];
                const foundServicio = servicios.find(s => s.id === parseInt(id));
                if (foundServicio) {
                    setServicio(foundServicio);
                }
            }, 500);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServicio({ ...servicio, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar en la API
        alert(isEditing ? 'Servicio actualizado' : 'Servicio creado');
        navigate('/admin/servicios');
    };

    const iconosDisponibles = [
        'bi-cup-hot', 'bi-wifi', 'bi-water', 'bi-fire', 
        'bi-map', 'bi-p-square', 'bi-car-front', 'bi-bicycle',
        'bi-tv', 'bi-umbrella', 'bi-snow', 'bi-tree'
    ];

    return (
        <div className="container my-5">
            <h1 className="text-success">
                {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h1>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        name="titulo"
                        value={servicio.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        rows="3"
                        value={servicio.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="icono" className="form-label">Icono</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className={`bi ${servicio.icono}`}></i>
                        </span>
                        <select
                            className="form-select"
                            id="icono"
                            name="icono"
                            value={servicio.icono}
                            onChange={handleChange}
                            required
                        >
                            {iconosDisponibles.map(icono => (
                                <option key={icono} value={icono}>
                                    {icono}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        min="0"
                        value={servicio.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="activo"
                        name="activo"
                        checked={servicio.activo}
                        onChange={(e) => setServicio({ ...servicio, activo: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="activo">Activo</label>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                        type="button" 
                        className="btn btn-secondary me-md-2"
                        onClick={() => navigate('/admin/servicios')}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminServicioForm;