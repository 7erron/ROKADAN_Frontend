import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false
    });

    // Inicializar desde localStorage al cargar
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
            setAuthState({
                token,
                user,
                isAuthenticated: true,
                isAdmin: user?.es_admin || false
            });
        }
    }, []);

    const login = async (credentials) => {
        try {
          const response = await loginUser(credentials); // Llama al backend real
          const userData = response.user;
          
          const isAdminUser = userData.es_admin || false;
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(isAdminUser);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false
        });
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};