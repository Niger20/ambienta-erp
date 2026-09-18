import type { Repartidor, Delivery } from './types';

export function useResumenDiario(deliveries: Delivery[], repartidores: Repartidor[]) {
    const today = new Date().toISOString().split('T')[0];
    const deliveriesHoy = deliveries.filter(d => {
        if (!d.fecha) return true;
        return d.fecha.startsWith(today);
    });

    const resumenPorRepartidor = repartidores.map(r => {
        const rid = r.id ?? r.repartidorid;
        const misDeliveries = deliveriesHoy.filter(d => d.repartidorid === rid);
        return {
            nombre: r.nombre,
            telefono: r.telefono,
            totalEntregas: misDeliveries.length,
            montoTotal: misDeliveries.reduce((s, d) => s + Number(d.costo || 0), 0),
        };
    });

    return { today, deliveriesHoy, resumenPorRepartidor };
}
