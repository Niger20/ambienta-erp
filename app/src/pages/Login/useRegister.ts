import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export function useRegister() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                nombreusuario: username,
                nombre,
                correo,
                contrasena: password,
                confirmarcontrasena: confirmPassword,
            });

            setSuccess(response.data?.mensaje || 'Cuenta creada. Revisa tu correo para verificarla.');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'No se pudo completar el registro.');
        } finally {
            setLoading(false);
        }
    };

    return {
        nombre, setNombre,
        correo, setCorreo,
        username, setUsername,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        error, success, loading,
        handleRegister,
    };
}
