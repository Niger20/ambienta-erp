import { useMemo } from 'react';
import { getDatesInRange } from './types';

export function useEvolutionTimelines(allSales: any[], allProducts: any[], allMovements: any[], fechaInicio: string, fechaFin: string) {
    const salesTimeline = useMemo(() => {
        const dates = getDatesInRange(fechaInicio, fechaFin);
        const activeSales = allSales.filter(s => s.estado !== false);
        return dates.map(dStr => {
            const daySales = activeSales.filter(s => s.fecha.split('T')[0] === dStr);
            const totalVal = daySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
            return { dateStr: dStr, total: totalVal };
        });
    }, [allSales, fechaInicio, fechaFin]);

    const stockTimeline = useMemo(() => {
        const dates = getDatesInRange(fechaInicio, fechaFin);
        if (allProducts.length === 0) return dates.map(d => ({ dateStr: d, stock: 0 }));

        const currentStock = allProducts.reduce((s, p) => s + Number(p.stockactual || 0), 0);
        const sortedMovs = [...allMovements].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        return dates.map(dStr => {
            const endOfDay = new Date(dStr + 'T23:59:59').getTime();
            const movsAfter = sortedMovs.filter(m => new Date(m.fecha).getTime() > endOfDay);

            let stockAtDate = currentStock;
            for (const m of movsAfter) {
                const qty = Number(m.cantidad || 0);
                if (m.tipomovimiento === 'INGRESO') {
                    stockAtDate -= qty;
                } else if (m.tipomovimiento === 'EGRESO') {
                    stockAtDate += qty;
                }
            }
            return { dateStr: dStr, stock: Math.max(0, stockAtDate) };
        });
    }, [allProducts, allMovements, fechaInicio, fechaFin]);

    return { salesTimeline, stockTimeline };
}
