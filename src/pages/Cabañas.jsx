import React, { useState, useEffect } from 'react';
import CabanaCard from '../components/CabanaCard';

function Cabañas() {
    const [cabanas, setCabanas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Simulación de obtención de datos
        setTimeout(() => {
            setCabanas([
                {
                    id: 1,
                    nombre: "Cabaña El Pinar",
                    descripcion: "Hermosa cabaña en medio del bosque con vistas panorámicas.",
                    precio: 25000,
                    capacidad: 4,
                    imagen: "https://img.freepik.com/fotos-premium/cabana-ubicada-bosque-vistas-majestuosas-montanas-vista-panoramica-cabana-acogedora-ubicada-montanas-vista-panoramica_538213-117682.jpg?w=996"
                },
                {
                    id: 2,
                    nombre: "Cabaña La Montaña",
                    descripcion: "Acogedora cabaña de montaña ideal para desconectar.",
                    precio: 32000,
                    capacidad: 6,
                    imagen: "https://a0.muscache.com/im/pictures/cc8ea353-3f63-4d4d-ba2f-baac82e62318.jpg?im_w=1200"
                },
                {
                    id: 3,
                    nombre: "Cabaña El Lago",
                    descripcion: "Moderna cabaña con acceso directo al lago.",
                    precio: 45000,
                    capacidad: 8,
                    imagen: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/515320035.jpg?k=c51839eac8f74086e2d9a61f90dfdf0c739a632221bf4c08c88419ee47c696aa&o="
                },
                {
                    id: 4,
                    nombre: "Cabaña El Bosque",
                    descripcion: "Cabaña rústica rodeada de naturaleza.",
                    precio: 28000,
                    capacidad: 5,
                    imagen: "https://www.hotelesparaadultos.com/img5/lapau-casasruralesbarcelona.jpg"
                },
                {
                    id: 5,
                    nombre: "Cabaña La Cascada",
                    descripcion: "Cabaña con vistas a una cascada cercana.",
                    precio: 35000,
                    capacidad: 7,
                    imagen: "https://scontent.fscl7-1.fna.fbcdn.net/v/t1.6435-9/89657016_2938038996234673_600702587104133120_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QPLzRlLTFCwQ7kNvwEdLAte&_nc_oc=AdkkiteEXSH6gIqsfbKfHqwR2rHqSSajXeQ2ijkjBQ5KbPgUPEOJzA3w4iDFXedeiIw&_nc_zt=23&_nc_ht=scontent.fscl7-1.fna&_nc_gid=2chSFsdLNiV9a3U2wE8uRg&oh=00_AYFBUVXMdbe1cdmtSeF16UXq0fNO0EO0JGf9io-_jIOtZQ&oe=68183E7E"
                },
                {
                    id: 6,
                    nombre: "Cabaña El Mirador",
                    descripcion: "Cabaña con terraza y vistas impresionantes.",
                    precio: 40000,
                    capacidad: 6,
                    imagen: "https://www.monteverdepucon.cl/wp-content/uploads/2018/12/Caba%C3%B1a-3-dorm-6-hu%C3%A9spedes-Monte-Verde-Puc%C3%B3n-1.jpg"
                },
                {
                    id: 7,
                    nombre: "Cabaña La Pradera",
                    descripcion: "Cabaña amplia en una pradera tranquila.",
                    precio: 30000,
                    capacidad: 5,
                    imagen: "https://a0.muscache.com/im/pictures/b405b047-ae5b-4ee0-a035-cd0672a56b84.jpg?im_w=960"
                },
                {
                    id: 8,
                    nombre: "Cabaña El Refugio",
                    descripcion: "Cabaña acogedora perfecta para parejas.",
                    precio: 20000,
                    capacidad: 2,
                    imagen: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIxODgzODM3ODE1MjcxNjg2OA%3D%3D/original/d6157fb1-79f6-4dc1-ba5e-4dca515c8faa.jpeg?im_w=1200"
                },
                {
                    id: 9,
                    nombre: "Cabaña La Colina",
                    descripcion: "Cabaña en lo alto de una colina con vistas al valle.",
                    precio: 38000,
                    capacidad: 6,
                    imagen: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzY0NDMzMTAzMDQ5NTYxODUx/original/d37cda3e-de11-4581-afd4-7c0be034434c.jpeg?im_w=720"                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <main>
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h1 className="text-success">CABAÑAS</h1>
                        <p>REVISE NUESTRAS CABAÑAS DISPONIBLES.</p>
                    </div>
                </div>
                
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {cabanas.map(cabana => (
                            <div className="col-md-4" key={cabana.id}>
                                <CabanaCard {...cabana} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cabañas;