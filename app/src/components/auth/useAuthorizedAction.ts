import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useEmpleadoAutorizacionWS } from '../../hooks/useAutorizacionWS';

export interface AuthModalProps {
    open: boolean;
    label: string;
    codeInput: string;
    onCodeChange: (value: string) => void;
    error: string;
    isVerifying: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

interface UseAuthorizedActionResult {
    isAdmin: boolean;
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>;
    authModalProps: AuthModalProps;
}

/**
 * Flujo de autorización con PIN para acciones sensibles: si el usuario es
 * admin, ejecuta directo; si no, pide un PIN a un admin vía WebSocket y solo
 * ejecuta la acción si el PIN es válido.
 *
 * Extraído verbatim de la lógica que estaba duplicada en Products.tsx,
 * Sales.tsx, Purchases.tsx y Deliveries.tsx.
 */
export function useAuthorizedAction(): UseAuthorizedActionResult {
    const { user } = useAuth();
    const isAdmin = user?.rol === 'administrador';

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authCodeInput, setAuthCodeInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
    const [pendingAuthAction, setPendingAuthAction] = useState<(() => Promise<void>) | null>(null);
    const [pendingAuthLabel, setPendingAuthLabel] = useState('');
    const [pendingAuthId, setPendingAuthId] = useState<number | null>(null);

    const requestAuth = async (accion: string, detalle: string, onSuccess: () => Promise<void>) => {
        if (isAdmin) { await onSuccess(); return; }
        try {
            const res = await api.post('/autorizaciones', { accion, detalle });
            const authId = res.data?.autorizacionid ?? res.data?.id ?? null;
            setPendingAuthAction(() => onSuccess);
            setPendingAuthLabel(detalle);
            setPendingAuthId(authId);
            setAuthCodeInput('');
            setAuthError('');
            setShowAuthModal(true);
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo solicitar autorización.', 'error');
        }
    };

    // Escuchar resolución de autorización vía WebSocket (sin polling)
    useEmpleadoAutorizacionWS({
        autorizacionid: showAuthModal ? pendingAuthId : null,
        onAprobado: () => {
            // El admin aprobó — el empleado debe ingresar el PIN manualmente
        },
        onRechazado: () => {
            setShowAuthModal(false);
            setPendingAuthAction(null);
            setPendingAuthId(null);
            Swal.fire({ icon: 'error', title: 'Solicitud rechazada', text: 'El administrador rechazó la solicitud.', timer: 3000, showConfirmButton: false });
        },
    });

    const handleVerifyAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authCodeInput || !pendingAuthAction) return;
        setIsVerifyingAuth(true);
        setAuthError('');
        try {
            await api.post('/autorizaciones/validar', { codigo: authCodeInput });
            const action = pendingAuthAction;
            setShowAuthModal(false);
            setPendingAuthAction(null);
            await action();
        } catch (err: any) {
            setAuthError(err.response?.data?.error || 'Código incorrecto o denegado.');
        } finally {
            setIsVerifyingAuth(false);
        }
    };

    const authModalProps: AuthModalProps = {
        open: showAuthModal,
        label: pendingAuthLabel,
        codeInput: authCodeInput,
        onCodeChange: (value: string) => setAuthCodeInput(value.replace(/\D/g, '')),
        error: authError,
        isVerifying: isVerifyingAuth,
        onSubmit: handleVerifyAuth,
        onCancel: () => { setShowAuthModal(false); setPendingAuthAction(null); },
    };

    return { isAdmin, requestAuth, authModalProps };
}
