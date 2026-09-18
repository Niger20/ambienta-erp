import { useState, useMemo } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useGastosReport(setIsLoading: (v: boolean) => void) {
    const [gastosData, setGastosData] = useState<any[]>([]);
    const [pagoGastosData, setPagoGastosData] = useState<any[]>([]);

    const fetchGastos = async () => {
        setIsLoading(true);
        try {
            const [gastosRes, pagoGastosRes] = await Promise.all([
                api.get('/gastos?limit=0'),
                api.get('/pago-gastos?limit=0'),
            ]);
            const data = getArrayData(gastosRes.data, 'gastos').filter(
                (g: any) => g.nombre?.trim().toLowerCase() !== 'retiros de efectivo'
            );
            const pagos = getArrayData(pagoGastosRes.data, 'pagoGastos');
            setGastosData(data);
            setPagoGastosData(pagos);
        } catch { setGastosData([]); setPagoGastosData([]); }
        finally { setIsLoading(false); }
    };

    const gastosSummary = useMemo(() => {
        const pagosByGasto: Record<number, any[]> = {};
        pagoGastosData.forEach((pg: any) => {
            const gid = pg.gastoid;
            if (!pagosByGasto[gid]) pagosByGasto[gid] = [];
            pagosByGasto[gid].push(pg);
        });

        const getTotalPagado = (gid: number) => {
            const pagos = pagosByGasto[gid] || [];
            return pagos.reduce((s: number, pg: any) => {
                const p = pg.pago ?? pg.pagos ?? {};
                return s + Number(p.monto || 0);
            }, 0);
        };

        const grandTotal = gastosData.reduce((s, g) => s + getTotalPagado(g.gastoid ?? g.id), 0);

        return {
            pagosByGasto,
            getTotalPagado,
            grandTotal,
        };
    }, [gastosData, pagoGastosData]);

    return { gastosData, fetchGastos, gastosSummary };
}
