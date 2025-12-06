'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'rhytheme_access_token',
    REFRESH_TOKEN: 'rhytheme_refresh_token',
    USER: 'rhytheme_user',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Load stored auth state on mount
    useEffect(() => {
        const loadStoredAuth = () => {
            try {
                const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const userJson = localStorage.getItem(STORAGE_KEYS.USER);
                const user = userJson ? JSON.parse(userJson) : null;

                if (accessToken && user) {
                    setState({
                        user,
                        accessToken,
                        refreshToken,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Failed to load auth state:', error);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        loadStoredAuth();
    }, []);

    const saveAuthState = useCallback((user: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        setState({
            user,
            accessToken,
            refreshToken,
            isLoading: false,
            isAuthenticated: true,
        });
    }, []);

    const clearAuthState = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isAuthenticated: false,
        });
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Login failed');
        }

        const { user, accessToken, refreshToken } = data.data;
        saveAuthState(user, accessToken, refreshToken);
    }, [saveAuthState]);

    const register = useCallback(async (username: string, email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Registration failed');
        }

        const { user, accessToken, refreshToken } = data.data;
        saveAuthState(user, accessToken, refreshToken);
    }, [saveAuthState]);

    const logout = useCallback(() => {
        clearAuthState();
    }, [clearAuthState]);

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                clearAuthState();
                return false;
            }

            const data = await response.json();
            const { accessToken, refreshToken: newRefreshToken } = data.data;
            
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            
            setState(prev => ({
                ...prev,
                accessToken,
                refreshToken: newRefreshToken,
            }));

            return true;
        } catch (error) {
            clearAuthState();
            return false;
        }
    }, [clearAuthState]);

    const contextValue: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        refreshAccessToken,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
