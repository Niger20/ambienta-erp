import { useState, useEffect } from 'react';
import type { POSData } from './types';

export function useCustomerDisplayData() {
    const [data, setData] = useState<POSData>({
        lineas: [],
        subtotal: 0,
        descuentoTotal: 0,
        total: 0,
        totalItems: 0,
    });
    const [lastAddedId, setLastAddedId] = useState<number | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const channel = new BroadcastChannel('pos-customer-display');

        channel.onmessage = (event) => {
            const msg = event.data;
            if (msg.type === 'pos-update') {
                setData(msg.payload);
                setConnected(true);
            }
            if (msg.type === 'pos-cambio') {
                setData(prev => ({ ...prev, montoRecibido: msg.montoRecibido, cambio: msg.cambio }));
            }
            if (msg.type === 'pos-item-added') {
                setLastAddedId(msg.productId);
                setTimeout(() => setLastAddedId(null), 1200);
            }
        };

        // Request initial data from POS tab
        channel.postMessage({ type: 'customer-ready' });

        return () => channel.close();
    }, []);

    return { data, lastAddedId, connected };
}
