import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://rokadan-backend.onrender.com';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_URL}/api`, // 👈 Se añade '/api' aquí
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { message: 'Error de conexión' });
  }
);

// Funciones de autenticación
export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/registrar', userData);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Funciones para cabañas
export const getCabanas = async () => (await api.get('/cabanas')).data;
export const getCabanaById = async (id) => (await api.get(`/cabanas/${id}`)).data;
export const getCabanasDestacadas = async () => (await api.get('/cabanas/destacadas')).data;
export const getCabanasDisponibles = async (params) => (await api.get('/cabanas/disponibles', { params })).data;
export const createCabana = async (data) => (await api.post('/cabanas', data)).data;
export const updateCabana = async (id, data) => (await api.patch(`/cabanas/${id}`, data)).data;
export const deleteCabana = async (id) => (await api.delete(`/cabanas/${id}`)).data;

// Funciones para servicios
export const getServicios = async () => (await api.get('/servicios')).data;
export const getServicioById = async (id) => (await api.get(`/servicios/${id}`)).data;

// Funciones para reservas
export const createReserva = async (data) => (await api.post('/reservas', data)).data;
export const getReservasUsuario = async (userId) => (await api.get(`/reservas/usuario/${userId}`)).data;
export const getReservaById = async (id) => (await api.get(`/reservas/${id}`)).data;
export const updateReserva = async (id, data) => (await api.patch(`/reservas/${id}`, data)).data;
export const cancelReserva = async (id) => (await api.delete(`/reservas/${id}`)).data;

// Funciones para pagos
export const createPago = async (data) => (await api.post('/pagos', data)).data;
export const getPagoById = async (id) => (await api.get(`/pagos/${id}`)).data;

// Exportar instancia
export default api;
