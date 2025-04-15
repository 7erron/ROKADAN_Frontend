import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Función genérica para hacer requests
async function makeRequest(method, endpoint, data = null, options = {}) {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      ...options
    });

    return response.data;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error.response?.data || error.message;
  }
}

// Funciones específicas para Cabañas
export async function getCabanas() {
  return makeRequest('get', '/api/cabanas');
}

export async function getCabanaById(id) {
  return makeRequest('get', `/api/cabanas/${id}`);
}

export async function getCabanasDestacadas() {
  return makeRequest('get', '/api/cabanas/destacadas');
}

export async function getCabanasDisponibles(params) {
  return makeRequest('get', '/api/cabanas/disponibles', null, { params });
}

// Funciones de autenticación
export async function loginUser(credentials) {
  return makeRequest('post', '/api/auth/login', credentials);
}

export async function registerUser(userData) {
  return makeRequest('post', '/api/auth/register', userData);
}

// Funciones de reservas
export async function createReserva(reservaData) {
  return makeRequest('post', '/api/reservas', reservaData);
}

export async function getReservasUsuario(userId) {
  return makeRequest('get', `/api/reservas/usuario/${userId}`);
}

export async function updateReserva(id, reservaData) {
  return makeRequest('patch', `/api/reservas/${id}`, reservaData);
}