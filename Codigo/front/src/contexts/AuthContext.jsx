/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = () => {
            const storageUser = sessionStorage.getItem('@Amabilis:user');
            const storageToken = sessionStorage.getItem('@Amabilis:token');

            if (storageUser && storageToken) {
                setUser(JSON.parse(storageUser));
                // O interceptor já está no api.js, não precisa setar o header manual aqui!
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const login = async (email, senha) => {
        try {
            // O payload está idêntico ao LoginRequestDTO do Spring Boot
            const response = await api.post('/auth/login', { 
                email: email, 
                senha: senha 
            });
            
            // A resposta vai bater com o LoginResponseDTO do Spring Boot
            const { token, nome, email: emailResponse } = response.data; 
            
            if (!token) {
                console.error("Token não encontrado na resposta:", response.data);
                return false;
            }

            const usuario = {
                nome: nome || 'Usuário',
                email: emailResponse || email
            };

            setUser(usuario);
            sessionStorage.setItem('@Amabilis:user', JSON.stringify(usuario));
            sessionStorage.setItem('@Amabilis:token', token);

            return true; 
        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            return false; 
        }
    };

    const logout = () => {
        sessionStorage.removeItem('@Amabilis:user');
        sessionStorage.removeItem('@Amabilis:token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);