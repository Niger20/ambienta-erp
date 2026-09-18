import { useState } from 'react';
import type { Repartidor, Delivery } from './types';

interface ResumenRow {
    nombre: string;
    telefono: string;
    totalEntregas: number;
    montoTotal: number;
}

export function useDeliveriesFilters(
    activeDeliveries: Delivery[],
    activeRepartidores: Repartidor[],
    resumenPorRepartidor: ResumenRow[],
) {
    const [deliverySearchQuery, setDeliverySearchQuery] = useState('');
    const [repartidorSearchQuery, setRepartidorSearchQuery] = useState('');
    const [resumenSearchQuery, setResumenSearchQuery] = useState('');

    const filteredDeliveries = activeDeliveries.filter(d => {
        return String(d.id).includes(deliverySearchQuery) ||
            (d.repartidornombre || '').toLowerCase().includes(deliverySearchQuery.toLowerCase());
    });

    const filteredRepartidores = activeRepartidores.filter(r => {
        return r.nombre.toLowerCase().includes(repartidorSearchQuery.toLowerCase()) ||
            String(r.telefono).includes(repartidorSearchQuery);
    });

    const filteredResumen = resumenPorRepartidor.filter(r => {
        return r.nombre.toLowerCase().includes(resumenSearchQuery.toLowerCase()) ||
            String(r.telefono).includes(resumenSearchQuery);
    });

    return {
        deliverySearchQuery, setDeliverySearchQuery, filteredDeliveries,
        repartidorSearchQuery, setRepartidorSearchQuery, filteredRepartidores,
        resumenSearchQuery, setResumenSearchQuery, filteredResumen,
    };
}
