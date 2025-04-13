import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminCabanaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cabana, setCabana] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        capacidad: '',
        imagen: '',
        disponible: true
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            // Simulación de carga de datos
            setTimeout(() => {
                const cabanas = [
                    {
                        id: 1,
                        nombre: "Cabaña El Pinar",
                        descripcion: "Hermosa cabaña en medio del bosque con vistas panorámicas.",
                        precio: 25000,
                        capacidad: 4,
                        imagen: "https://img.freepik.com/fotos-premium/cabana-ubicada-bosque-vistas-majestuosas-montanas-vista-panoramica-cabana-acogedora-ubicada-montanas-vista-panoramica_538213-117682.jpg?w=996",
                        disponible: true
                    }
                ];
                const foundCabana = cabanas.find(c => c.id === parseInt(id));
                if (foundCabana) {
                    setCabana(foundCabana);
                }
            }, 500);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCabana({ ...cabana, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar en la API
        alert(isEditing ? 'Cabaña actualizada' : 'Cabaña creada');
        navigate('/admin/cabanas');
    };

    return (
        <div className="container my-5">
            <h1 className="text-success">
                {isEditing ? 'Editar Cabaña' : 'Nueva Cabaña'}
            </h1>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={cabana.nombre}
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
                        value={cabana.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="precio" className="form-label">Precio por noche</label>
                        <input
                            type="number"
                            className="form-control"
                            id="precio"
                            name="precio"
                            min="0"
                            value={cabana.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="capacidad" className="form-label">Capacidad (personas)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="capacidad"
                            name="capacidad"
                            min="1"
                            value={cabana.capacidad}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">URL de la imagen</label>
                    <input
                        type="url"
                        className="form-control"
                        id="imagen"
                        name="imagen"
                        value={cabana.imagen}
                        onChange={handleChange}
                        required
                    />
                    {cabana.imagen && (
                        <div className="mt-2">
                            <img 
                                src={cabana.imagen} 
                                alt="Vista previa" 
                                className="img-thumbnail" 
                                style={{ maxHeight: '200px' }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="disponible"
                        name="disponible"
                        checked={cabana.disponible}
                        onChange={(e) => setCabana({ ...cabana, disponible: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="disponible">Disponible</label>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                        type="button" 
                        className="btn btn-secondary me-md-2"
                        onClick={() => navigate('/admin/cabanas')}
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

export default AdminCabanaForm;