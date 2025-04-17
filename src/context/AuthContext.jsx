import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Cargar estado de autenticación desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin || false);
    }
  }, []);

  // Función para registrar usuario
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.correo,
        telefono: userData.telefono,
        password: userData.pass
      });
      
      // Iniciar sesión automáticamente después del registro
      login({
        email: userData.correo,
        nombre: userData.nombre,
        apellido: userData.apellido,
        id: response.data.id || Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };
  
  // Función para iniciar sesión
  const login = (userData) => {
    // Comprobar si es admin (ejemplo simple)
    const isAdminUser = userData.email === 'admin@cabanas.com';
    const updatedUserData = { 
      ...userData, 
      isAdmin: isAdminUser,
      id: userData.id || Date.now()
    };
    
    setUser(updatedUserData);
    setIsAuthenticated(true);
    setIsAdmin(isAdminUser);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };
  
  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isAdmin, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};