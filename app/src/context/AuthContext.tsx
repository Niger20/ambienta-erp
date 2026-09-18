import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

// Define the shape of our User and AuthContext data.
// Note: Adjust the interface based on your actual API user response.
export interface User {
    id: string | number;
    nombreusuario: string;
    rol: string;
    nombre?: string | null;
    correo?: string | null;
    correoVerificado?: boolean;
    fotoperfil?: string | null;
}

export interface ActiveSession {
    id: number;
    montoinicial: number;
    montofinalsistema?: number | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    permissions: string[];
    hasPermission: (codigo: string) => boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    activeSession: ActiveSession | null;
    setActiveSession: (session: ActiveSession | null) => void;
    refreshSession: () => Promise<void>;
    login: (token: string, userData: User, permissions?: string[]) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data on initial mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedPermissions = localStorage.getItem('permissions');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
            if (storedPermissions) {
                try {
                    setPermissions(JSON.parse(storedPermissions));
                } catch (e) {
                    console.error("Failed to parse stored permissions", e);
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, userData: User, newPermissions: string[] = []) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('permissions', JSON.stringify(newPermissions));
        setToken(newToken);
        setUser(userData);
        setPermissions(newPermissions);
    };

    const hasPermission = (codigo: string) => permissions.includes(codigo);

    const refreshSession = async () => {
        if (!user) return;
        try {
            // Import api dynamically or use fetch to avoid circular dependency if needed,
            // but for simplicity assuming we can fetch here. We will use the same logic as Header.
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/sesiones/active`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const sessionData = Array.isArray(data) ? data[0] : data;
                if (sessionData && (sessionData.id || sessionData.sesionid)) {
                    setActiveSession({
                        id: sessionData.id ?? sessionData.sesionid,
                        montoinicial: Number(sessionData.montoinicial),
                        montofinalsistema: sessionData.montofinalsistema != null ? Number(sessionData.montofinalsistema) : undefined
                    });
                    return;
                }
            }
            setActiveSession(null);
        } catch (error) {
            console.error("Failed to refresh session", error);
        }
    };

    const logout = async () => {
        const currentToken = token;

        // Limpia el estado local de inmediato (UX instantánea, sin carrera con la
        // redirección a /login) y revoca el token en el servidor en segundo plano.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        setToken(null);
        setUser(null);
        setPermissions([]);
        setActiveSession(null);

        if (!currentToken) return;
        try {
            // El interceptor ya no tiene token en localStorage para adjuntar, así
            // que se pasa explícitamente para que el servidor sí revoque el jti.
            await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${currentToken}` } });
        } catch (error) {
            console.error('Failed to revoke session server-side', error);
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, permissions, hasPermission, isAuthenticated, isLoading, activeSession, setActiveSession, refreshSession, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
