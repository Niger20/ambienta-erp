import { useEffect, useRef, useCallback } from 'react';

const WS_URL = (() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws/autorizaciones`;
})();

export type AuthEstado = 'APROBADO' | 'RECHAZADO';

interface UseAdminWsOptions {
    enabled: boolean;
    onNuevaSolicitud: (autorizacion: any) => void;
}

interface UseEmpleadoWsOptions {
    autorizacionid: number | null;
    onAprobado: (codigo: string) => void;
    onRechazado: () => void;
}

// ─── Hook para ADMIN (escucha nuevas solicitudes) ─────────────────────────────
export function useAdminAutorizacionWS({ enabled, onNuevaSolicitud }: UseAdminWsOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const onNuevaSolicitudRef = useRef(onNuevaSolicitud);
    onNuevaSolicitudRef.current = onNuevaSolicitud;

    useEffect(() => {
        if (!enabled) return;

        let reconnectTimer: ReturnType<typeof setTimeout>;

        const connect = () => {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: 'subscribe_admin' }));
            };

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'NUEVA_SOLICITUD') {
                        onNuevaSolicitudRef.current(msg.autorizacion);
                    }
                } catch { /* ignore */ }
            };

            ws.onclose = () => {
                // Reconectar automáticamente tras 3s
                reconnectTimer = setTimeout(connect, 3000);
            };

            ws.onerror = () => ws.close();
        };

        connect();

        return () => {
            clearTimeout(reconnectTimer);
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [enabled]);
}

// ─── Hook para EMPLEADO (espera resolución de su autorización) ────────────────
export function useEmpleadoAutorizacionWS({ autorizacionid, onAprobado, onRechazado }: UseEmpleadoWsOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const onAprobadoRef  = useRef(onAprobado);
    const onRechazadoRef = useRef(onRechazado);
    onAprobadoRef.current  = onAprobado;
    onRechazadoRef.current = onRechazado;

    const disconnect = useCallback(() => {
        wsRef.current?.close();
        wsRef.current = null;
    }, []);

    useEffect(() => {
        if (!autorizacionid) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'subscribe_empleado', autorizacionid }));
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'ESTADO_ACTUALIZADO' && msg.autorizacionid === autorizacionid) {
                    if (msg.estado === 'APROBADO') {
                        onAprobadoRef.current(msg.codigo ?? '');
                    } else if (msg.estado === 'RECHAZADO') {
                        onRechazadoRef.current();
                    }
                    disconnect();
                }
            } catch { /* ignore */ }
        };

        ws.onerror = () => ws.close();

        return () => disconnect();
    }, [autorizacionid, disconnect]);
}
