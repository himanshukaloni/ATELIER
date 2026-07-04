import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiRequest from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const { showToast } = useToast();

    const checkAuth = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
            setAuthLoading(false);
            return;
        }
        try {
            const me = await apiRequest('/auth/me', {}, currentToken);
            setUser(me);
            setToken(currentToken);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            showToast('Welcome back!');
            return true;
        } catch (error) {
            showToast(error.message || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            showToast('Account created!');
            return true;
        } catch (error) {
            showToast(error.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        showToast('Logged out');
    };

    return (
        <AuthContext.Provider value={{ token, user, authLoading, login, register, logout, refreshUser: checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
