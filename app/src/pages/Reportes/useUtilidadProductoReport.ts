import { useState, useMemo } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

type SortField = 'cantidadVendida' | 'totalGenerado' | 'utilidad' | 'margen';

export function useUtilidadProductoReport(fechaInicio: string, fechaFin: string, setIsLoading: (v: boolean) => void) {
    const [utilidadProductoData, setUtilidadProductoData] = useState<any[]>([]);
    const [utilidadProductoSearch, setUtilidadProductoSearch] = useState('');
    const [utilidadSortField, setUtilidadSortField] = useState<SortField>('utilidad');
    const [utilidadSortDirection, setUtilidadSortDirection] = useState<'asc' | 'desc'>('desc');

    const fetchUtilidadProducto = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/reportes/utilidad-producto?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            setUtilidadProductoData(getArrayData(res.data));
        } catch { setUtilidadProductoData([]); }
        finally { setIsLoading(false); }
    };

    const filteredAndSortedUtilidadProducto = useMemo(() => {
        const query = utilidadProductoSearch.toLowerCase().trim();
        let filtered = utilidadProductoData;
        if (query) {
            filtered = utilidadProductoData.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                (p.codigobarra && p.codigobarra.toLowerCase().includes(query)) ||
                (p.categoria && p.categoria.toLowerCase().includes(query))
            );
        }
        return [...filtered].sort((a, b) => {
            const valA = Number(a[utilidadSortField] || 0);
            const valB = Number(b[utilidadSortField] || 0);
            return utilidadSortDirection === 'asc' ? valA - valB : valB - valA;
        });
    }, [utilidadProductoData, utilidadProductoSearch, utilidadSortField, utilidadSortDirection]);

    const utilidadProductoSummary = useMemo(() => {
        const totalRev = utilidadProductoData.reduce((s, p) => s + Number(p.totalGenerado || 0), 0);
        const totalCost = utilidadProductoData.reduce((s, p) => s + Number(p.totalCosto || 0), 0);
        const totalProfit = utilidadProductoData.reduce((s, p) => s + Number(p.utilidad || 0), 0);
        const marginAvg = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
        return { totalRev, totalCost, totalProfit, marginAvg };
    }, [utilidadProductoData]);

    return {
        utilidadProductoData, fetchUtilidadProducto,
        utilidadProductoSearch, setUtilidadProductoSearch,
        utilidadSortField, setUtilidadSortField,
        utilidadSortDirection, setUtilidadSortDirection,
        filteredAndSortedUtilidadProducto, utilidadProductoSummary,
    };
}
