import { useState, useEffect } from 'react';

/**
 * Mensajes toast del POS. `showError`/`showSuccess` se autolimpian (patrón
 * repetido en todo el POS original: setError(msg) + setTimeout(3s)).
 * `setError` crudo se expone para validaciones de checkout que deben
 * persistir hasta que el usuario corrija o el submit tenga éxito.
 */
export function useToast() {
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 3000);
    };

    useEffect(() => {
        if (successMsg) {
            const t = setTimeout(() => setSuccessMsg(''), 5000);
            return () => clearTimeout(t);
        }
    }, [successMsg]);

    return { error, setError, showError, successMsg, setSuccessMsg };
}
