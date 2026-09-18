import axios from 'axios';

// En producción: el frontend está servido por el mismo backend,
// así que /api funciona como URL relativa (mismo origen).
// En desarrollo: Vite hace proxy de /api → http://localhost:3000/api automáticamente.
// Solo define VITE_API_URL si apuntas a un backend externo.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add authorization token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Only redirect to login if we got a 401 on an authenticated route
        // and the URL is NOT the login/auth endpoint itself
        const requestUrl = error.config?.url || '';
        const isAuthRoute = requestUrl.includes('/auth/') || requestUrl.includes('/login');

        if (error.response?.status === 401 && !isAuthRoute) {
            // Token is invalid/expired — clear session and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
