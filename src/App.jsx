import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QuienesSomos from "./pages/QuienesSomos";
import Cabanas from "./pages/Cabanas";
import Servicios from "./pages/Servicios";
import Reservas from "./pages/Reservas";
import MisReservas from "./pages/MisReservas";
import DetalleCabaña from "./pages/DetalleCabana";
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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quienessomos" element={<QuienesSomos />} />
          <Route path="/cabanas" element={<Cabanas />} />
          <Route path="/cabanas/:id" element={<DetalleCabaña />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reservas/:id" element={<Reservas />} />
          <Route path="/misreservas" element={<MisReservas />} />
          <Route path="/pago" element={<Pago />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/cabanas" element={<ProtectedRoute adminOnly={true}><AdminCabanas /></ProtectedRoute>} />
          <Route path="/admin/cabanas/nueva" element={<ProtectedRoute adminOnly={true}><AdminCabanaForm /></ProtectedRoute>} />
          <Route path="/admin/cabanas/editar/:id" element={<ProtectedRoute adminOnly={true}><AdminCabanaForm /></ProtectedRoute>} />
          <Route path="/admin/servicios" element={<ProtectedRoute adminOnly={true}><AdminServicios /></ProtectedRoute>} />
          <Route path="/admin/servicios/nuevo" element={<ProtectedRoute adminOnly={true}><AdminServicioForm /></ProtectedRoute>} />
          <Route path="/admin/servicios/editar/:id" element={<ProtectedRoute adminOnly={true}><AdminServicioForm /></ProtectedRoute>} />
          <Route path="/admin/reservas" element={<ProtectedRoute adminOnly={true}><AdminReservas /></ProtectedRoute>} />
          <Route path="/admin/reservas/:id" element={<ProtectedRoute adminOnly={true}><AdminReservaDetalle /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;