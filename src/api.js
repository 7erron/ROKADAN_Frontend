import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://rokadan-backend.onrender.com';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
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
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { message: 'Error de conexión' });
  }
);

// Funciones de autenticación
export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/registrar', {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      telefono: userData.telefono,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para cabañas
export const getCabanas = async () => {
  try {
    const response = await api.get('/api/cabanas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCabanaById = async (id) => {
  try {
    const response = await api.get(`/api/cabanas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCabanasDestacadas = async () => {
  try {
    const response = await api.get('/api/cabanas/destacadas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCabanasDisponibles = async ({ fechaInicio, fechaFin, adultos = 1, ninos = 0 }) => {
  try {
    const response = await api.get('/api/cabanas/disponibles', {
      params: { fechaInicio, fechaFin, adultos, ninos }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCabana = async (cabanaData) => {
  try {
    const response = await api.post('/api/cabanas', cabanaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCabana = async (id, cabanaData) => {
  try {
    const response = await api.patch(`/api/cabanas/${id}`, cabanaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCabana = async (id) => {
  try {
    const response = await api.delete(`/api/cabanas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para servicios
export const getServicios = async () => {
  try {
    const response = await api.get('/api/servicios');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicioById = async (id) => {
  try {
    const response = await api.get(`/api/servicios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para reservas
export const createReserva = async (reservaData) => {
  try {
    const response = await api.post('/api/reservas', reservaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservasUsuario = async (userId) => {
  try {
    const response = await api.get(`/api/reservas/usuario/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservaById = async (id) => {
  try {
    const response = await api.get(`/api/reservas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReserva = async (id, reservaData) => {
  try {
    const response = await api.patch(`/api/reservas/${id}`, reservaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelReserva = async (id) => {
  try {
    const response = await api.delete(`/api/reservas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para pagos
export const createPago = async (pagoData) => {
  try {
    const response = await api.post('/api/pagos', pagoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPagoById = async (id) => {
  try {
    const response = await api.get(`/api/pagos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Exportar la instancia de axios por si se necesita directamente
export default api;