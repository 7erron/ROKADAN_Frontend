import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QuienesSomos from "./pages/QuienesSomos";
import Cabañas from "./pages/Cabanas";
import Servicios from "./pages/Servicios";
import Reservas from "./pages/Reservas";
import MisReservas from "./pages/MisReservas";
import DetalleCabaña from "./pages/DetalleCabaña";
import Pago from "./pages/Pago";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCabanas from "./pages/admin/AdminCabanas";
import AdminServicios from "./pages/admin/AdminServicios";
import AdminReservas from "./pages/admin/AdminReservas";
import AdminCabanaForm from "./pages/admin/AdminCabanaForm";
import AdminServicioForm from "./pages/admin/AdminServicioForm";
import AdminReservaDetalle from "./pages/admin/AdminReservaDetalle";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";


axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://rokadan-backend.onrender.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Opcional: Agrega esto si usas autenticación JWT
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quienessomos" element={<QuienesSomos />} />
        <Route path="/cabañas" element={<Cabañas />} />
        <Route path="/cabanas/:id" element={<DetalleCabaña />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/reservas/:id" element={<Reservas />} />
        <Route path="/misreservas" element={<MisReservas />} />
        <Route path="/pago" element={<Pago />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/cabanas" element={<ProtectedRoute adminOnly><AdminCabanas /></ProtectedRoute>} />
        <Route path="/admin/cabanas/nueva" element={<ProtectedRoute adminOnly><AdminCabanaForm /></ProtectedRoute>} />
        <Route path="/admin/cabanas/editar/:id" element={<ProtectedRoute adminOnly><AdminCabanaForm /></ProtectedRoute>} />
        <Route path="/admin/servicios" element={<ProtectedRoute adminOnly><AdminServicios /></ProtectedRoute>} />
        <Route path="/admin/servicios/nuevo" element={<ProtectedRoute adminOnly><AdminServicioForm /></ProtectedRoute>} />
        <Route path="/admin/servicios/editar/:id" element={<ProtectedRoute adminOnly><AdminServicioForm /></ProtectedRoute>} />
        <Route path="/admin/reservas" element={<ProtectedRoute adminOnly><AdminReservas /></ProtectedRoute>} />
        <Route path="/admin/reservas/:id" element={<ProtectedRoute adminOnly><AdminReservaDetalle /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;