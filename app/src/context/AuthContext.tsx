import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define the shape of our User and AuthContext data. 
// Note: Adjust the interface based on your actual API user response.
export interface User {
    id: string | number;
    nombreusuario: string;
    rol: string;
}

export interface ActiveSession {
    id: number;
    montoinicial: number;
    montofinalsistema?: number | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    activeSession: ActiveSession | null;
    setActiveSession: (session: ActiveSession | null) => void;
    refreshSession: () => Promise<void>;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data on initial mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setActiveSession(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, activeSession, setActiveSession, refreshSession, login, logout }}>
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
