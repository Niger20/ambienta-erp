import { useState, useMemo } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useCxpReport(fechaInicio: string, fechaFin: string, setIsLoading: (v: boolean) => void) {
    const [cxpData, setCxpData] = useState<any[]>([]);
    const [proveedoresMap, setProveedoresMap] = useState<Record<number, any>>({});

    const fetchCxp = async () => {
        setIsLoading(true);
        try {
            const [cxpRes, provRes] = await Promise.all([
                api.get('/cuentas-por-pagar?limit=0'),
                api.get('/proveedores?limit=0'),
            ]);
            setCxpData(getArrayData(cxpRes.data, 'cuentas'));
            const proveedores = getArrayData(provRes.data, 'proveedores');
            const map: Record<number, any> = {};
            proveedores.forEach((p: any) => { map[p.id ?? p.proveedorid] = p; });
            setProveedoresMap(map);
        } catch { setCxpData([]); }
        finally { setIsLoading(false); }
    };

    const cxpSummary = useMemo(() => {
        const start = new Date(fechaInicio + 'T00:00:00');
        const end = new Date(fechaFin + 'T23:59:59');

        const activeCxp = cxpData.filter(c => c.estado !== false);

        const cxpEnRango = activeCxp.filter(c => {
            const fechaRef = c.fechacreacion || c.fecha || c.created_at;
            if (!fechaRef) return true;
            const d = new Date(fechaRef);
            return d >= start && d <= end;
        });

        const sumatoriaComprasTotales = cxpEnRango.reduce((acc, c) => acc + Number(c.montototal || 0), 0);
        const sumatoriaRestanteCxp = cxpEnRango.reduce((acc, c) => acc + Number(c.montorestante || 0), 0);
        const pagoAbonadoCxp = sumatoriaComprasTotales - sumatoriaRestanteCxp;

        return {
            cxpEnRango,
            activeCxp,
            sumatoriaComprasTotales,
            sumatoriaRestanteCxp,
            pagoAbonadoCxp,
        };
    }, [cxpData, fechaInicio, fechaFin]);

    return { cxpData, proveedoresMap, fetchCxp, cxpSummary };
}
