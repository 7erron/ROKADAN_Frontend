import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://rokadan-backend.onrender.com/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Manejar errores de autenticación (token expirado, inválido, etc.)
      console.error('Error de autenticación:', error.response.data);
      // Opcional: limpiar el localStorage y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?sessionExpired=true';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Función genérica para hacer requests
async function makeRequest(method, endpoint, data = null, params = null) {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      params
    });
    return response.data;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}

// Funciones específicas para Cabañas
export async function getCabanas() {
  return makeRequest('get', '/cabanas');
}

export async function getCabanaById(id) {
  return makeRequest('get', `/cabanas/${id}`);
}

export async function getCabanasDestacadas() {
  return makeRequest('get', '/cabanas/destacadas');
}

export async function getCabanasDisponibles(params) {
  return makeRequest('get', '/cabanas/disponibles', null, params);
}

// Funciones de autenticación
export async function loginUser({ email, password }) {
  return makeRequest('post', '/auth/login', { email, password });
}

export async function registerUser({ nombre, apellido, email, telefono, password, confirmPassword }) {
  return makeRequest('post', '/auth/registrar', { 
    nombre, 
    apellido, 
    email, 
    telefono, 
    password, 
    confirmPassword 
  });
}

export async function getCurrentUser() {
  return makeRequest('get', '/auth/me');
}

// Funciones de reservas
export async function createReserva(reservaData) {
  return makeRequest('post', '/reservas', reservaData);
}

export async function getReservasUsuario(userId) {
  return makeRequest('get', `/reservas/usuario/${userId}`);
}

export async function getMisReservas() {
  return makeRequest('get', '/reservas/mis-reservas');
}

export async function updateReserva(id, reservaData) {
  return makeRequest('patch', `/reservas/${id}`, reservaData);
}

export async function cancelReserva(id) {
  return makeRequest('delete', `/reservas/${id}`);
}

// Funciones de servicios
export async function getServicios() {
  return makeRequest('get', '/servicios');
}

export default api;