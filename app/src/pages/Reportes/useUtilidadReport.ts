import { useState } from 'react';
import api from '../../api/axios';

export function useUtilidadReport(fechaInicio: string, fechaFin: string, setIsLoading: (v: boolean) => void) {
    const [utilidadData, setUtilidadData] = useState<any>(null);

    const fetchUtilidad = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/reportes/utilidad-diaria?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            setUtilidadData(res.data);
        } catch { setUtilidadData(null); }
        finally { setIsLoading(false); }
    };

    return { utilidadData, fetchUtilidad };
}
