import { useRef, useEffect, useMemo } from 'react';
import type { LineaProducto } from './types';

export function useCustomerDisplaySync(
    lineas: LineaProducto[],
    setLineas: (fn: (prev: LineaProducto[]) => LineaProducto[]) => void,
    subtotal: number,
    descuentoTotal: number,
    total: number,
    totalItems: number,
    lastAdded: number | null,
    metodoPago: string,
    divisaPago: 'NIO' | 'USD',
    montoRecibidoNIONum: number,
    cambioNIO: number,
    montoRecibidoUSDNum: number,
    equivalenteEnCordobas: number,
    cambioEnCordobas: number,
) {
    const channelRef = useRef<BroadcastChannel | null>(null);

    // Initialize BroadcastChannel for customer display sync
    useEffect(() => {
        const channel = new BroadcastChannel('pos-customer-display');
        channelRef.current = channel;

        channel.onmessage = (event) => {
            if (event.data.type === 'customer-ready') {
                setLineas(prev => [...prev]);
            }
        };

        return () => channel.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Broadcast data to customer display tab whenever lineas change
    const broadcastPayload = useMemo(() => ({
        lineas, subtotal, descuentoTotal, total, totalItems,
    }), [lineas, subtotal, descuentoTotal, total, totalItems]);

    useEffect(() => {
        channelRef.current?.postMessage({ type: 'pos-update', payload: broadcastPayload });
    }, [broadcastPayload]);

    useEffect(() => {
        if (metodoPago === 'efectivo' && divisaPago === 'NIO' && montoRecibidoNIONum > 0) {
            channelRef.current?.postMessage({ type: 'pos-cambio', montoRecibido: montoRecibidoNIONum, cambio: cambioNIO });
        } else if (metodoPago === 'efectivo' && divisaPago === 'USD' && montoRecibidoUSDNum > 0) {
            channelRef.current?.postMessage({ type: 'pos-cambio', montoRecibido: equivalenteEnCordobas, cambio: cambioEnCordobas });
        } else {
            channelRef.current?.postMessage({ type: 'pos-cambio', montoRecibido: 0, cambio: 0 });
        }
    }, [montoRecibidoNIONum, cambioNIO, montoRecibidoUSDNum, equivalenteEnCordobas, cambioEnCordobas, metodoPago, divisaPago]);

    useEffect(() => {
        if (lastAdded !== null) {
            channelRef.current?.postMessage({ type: 'pos-item-added', productId: lastAdded });
        }
    }, [lastAdded]);

    const openCustomerDisplay = () => {
        window.open('/pos/cliente', 'customer-display', 'width=900,height=700');
    };

    return { openCustomerDisplay };
}
