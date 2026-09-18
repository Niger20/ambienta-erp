import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useTasaCambio() {
    const [tasaCambio, setTasaCambio] = useState<number>(36.50);

    useEffect(() => {
        api.get('/empresa').then(res => {
            const empresas = getArrayData(res.data);
            if (empresas && empresas.length > 0) {
                const tasa = Number(empresas[0].tasacambio);
                if (tasa > 0) setTasaCambio(tasa);
            }
        }).catch(() => { /* use default rate */ });
    }, []);

    return tasaCambio;
}
