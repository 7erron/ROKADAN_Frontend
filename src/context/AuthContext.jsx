import React, { createContext, useState, useEffect } from 'react';

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