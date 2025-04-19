import React, { createContext, useState, useEffect } from 'react';

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

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setAuthState({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isAdmin: data.user?.es_admin || false
        });
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