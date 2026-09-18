import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login/', {
                nombreusuario: username,
                password: password
            });

            login(response.data.token, response.data.user);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.error || 'Credenciales incorrectas. Verifica tu usuario y contraseña.');
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        error,
        loading,
        handleLogin,
    };
}
