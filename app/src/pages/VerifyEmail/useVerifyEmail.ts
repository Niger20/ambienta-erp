import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

export function useVerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando tu correo...');
    const requestedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('El enlace de verificación no es válido.');
            return;
        }

        // Evita el doble disparo de StrictMode en desarrollo, que consumiría
        // el token dos veces y reportaría "ya usado" aunque la primera sí funcionó.
        if (requestedRef.current === token) return;
        requestedRef.current = token;

        api.get(`/auth/verify-email/${token}`)
            .then((res) => {
                setStatus('success');
                setMessage(res.data?.mensaje || 'Correo verificado correctamente.');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.error || 'No se pudo verificar el correo.');
            });
    }, [token]);

    return { status, message };
}
