import { useState } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Gasto, PagoGasto } from './types';
import { getPago } from './types';

export function useGastoSelection() {
    const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
    const [pagos, setPagos] = useState<PagoGasto[]>([]);
    const [loadingPagos, setLoadingPagos] = useState(false);

    const fetchPagos = async (gastoid: number) => {
        setLoadingPagos(true);
        setPagos([]);
        try {
            const res = await api.get(`/pago-gastos/gasto/${gastoid}`);
            setPagos(getArrayData(res.data, 'pagoGastos'));
        } catch { setPagos([]); }
        finally { setLoadingPagos(false); }
    };

    const handleSelectGasto = (g: Gasto) => {
        const normalized: Gasto = {
            ...g,
            gastoid: g.gastoid ?? (g as any).id,
        };
        setSelectedGasto(normalized);
        fetchPagos(normalized.gastoid);
    };

    const totalPagadoGasto = () => pagos.reduce((s, p) => s + Number(getPago(p).monto || 0), 0);

    return { selectedGasto, setSelectedGasto, pagos, loadingPagos, fetchPagos, handleSelectGasto, totalPagadoGasto };
}
