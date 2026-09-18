import { useState, useMemo } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useCxcReport(fechaInicio: string, fechaFin: string, setIsLoading: (v: boolean) => void) {
    const [cxcData, setCxcData] = useState<any[]>([]);
    const [clientesMap, setClientesMap] = useState<Record<number, any>>({});

    const fetchCxc = async () => {
        setIsLoading(true);
        try {
            const [cxcRes, clientesRes] = await Promise.all([
                api.get('/cuentas-por-cobrar?limit=0'),
                api.get('/clientes?limit=0'),
            ]);
            setCxcData(getArrayData(cxcRes.data, 'cuentas'));
            const clientes = getArrayData(clientesRes.data, 'clientes');
            const map: Record<number, any> = {};
            clientes.forEach((c: any) => { map[c.id ?? c.clienteid] = c; });
            setClientesMap(map);
        } catch { setCxcData([]); }
        finally { setIsLoading(false); }
    };

    const cxcSummary = useMemo(() => {
        const hoy = new Date();
        const alertThreshold = new Date();
        alertThreshold.setDate(hoy.getDate() + 7);

        const start = new Date(fechaInicio + 'T00:00:00');
        const end = new Date(fechaFin + 'T23:59:59');

        const activeCxc = cxcData.filter(c => c.estado !== false);

        const cxcEnRango = activeCxc.filter(c => {
            const fechaRef = c.fechacreacion || c.fecha || c.created_at;
            if (!fechaRef) return true;
            const d = new Date(fechaRef);
            return d >= start && d <= end;
        });

        const sumatoriaIngresosEsperados = cxcEnRango.reduce((acc, c) => acc + Number(c.montototal || 0), 0);
        const sumatoriaRestante = cxcEnRango.reduce((acc, c) => acc + Number(c.montorestante || 0), 0);
        const montoRecuperado = sumatoriaIngresosEsperados - sumatoriaRestante;

        return {
            cxcEnRango,
            activeCxc,
            sumatoriaIngresosEsperados,
            sumatoriaRestante,
            montoRecuperado,
            alertThreshold,
            hoy,
        };
    }, [cxcData, fechaInicio, fechaFin]);

    return { cxcData, clientesMap, fetchCxc, cxcSummary };
}
