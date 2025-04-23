import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    // Inicializar desde localStorage al cargar
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
              const userData = await getCurrentUser();
              login(userData.user, storedToken);
            }
          } catch (error) {
            logout();
          } finally {
            setLoading(false);
          }
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.es_admin || false);
        navigate('/'); // Redirige a la página principal
      };
    
      const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        navigate('/login');
      };
    
      return (
        <AuthContext.Provider value={{ 
          isAuthenticated, 
          user, 
          isAdmin, 
          login, 
          logout,
          loading
        }}>
          {!loading && children}
        </AuthContext.Provider>
      );
    };