import { useState } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useGraficosData(setIsLoading: (v: boolean) => void) {
    const [allSales, setAllSales] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [allMovements, setAllMovements] = useState<any[]>([]);

    const fetchGraficosData = async () => {
        setIsLoading(true);
        try {
            const [salesRes, productsRes, movementsRes] = await Promise.all([
                api.get('/ventas?limit=0'),
                api.get('/productos?limit=0'),
                api.get('/movimientos-inventario?limit=0'),
            ]);
            setAllSales(getArrayData(salesRes.data, 'ventas'));
            setAllProducts(getArrayData(productsRes.data, 'productos'));
            setAllMovements(getArrayData(movementsRes.data, 'movimientos'));
        } catch (error) {
            console.error("Error loading data for graphs:", error);
            setAllSales([]);
            setAllProducts([]);
            setAllMovements([]);
        } finally {
            setIsLoading(false);
        }
    };

    return { allSales, allProducts, allMovements, fetchGraficosData };
}
