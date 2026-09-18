import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Gasto } from './types';

export function useGastosData() {
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchGastos = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/gastos?limit=0');
            const list: Gasto[] = getArrayData(res.data, 'gastos').filter(
                (g: Gasto) => g.nombre?.trim().toLowerCase() !== 'retiros de efectivo'
            );
            setGastos(list);
        } catch { setGastos([]); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchGastos(); }, []);

    const filtered = gastos.filter(g =>
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (g.descripcion || '').toLowerCase().includes(search.toLowerCase())
    );

    return { gastos, isLoading, fetchGastos, search, setSearch, filtered };
}
