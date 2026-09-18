import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Category, Product } from './types';

export function useProductsData() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [productsRes, categoriesRes, unidadesRes] = await Promise.all([
                api.get('/productos/?limit=0'),
                api.get('/categoria-productos/?limit=0'),
                api.get('/unidades-medida/?limit=0').catch(() => ({ data: [] }))
            ]);
            setProducts(getArrayData(productsRes.data, 'productos'));
            const rawCats = getArrayData(categoriesRes.data, 'categorias');
            const normalizedCats = rawCats.map((c: any) => ({
                id: Number(c.id ?? c.categoriaid),
                name: c.name || c.nombre || `Categoría #${c.id ?? c.categoriaid}`,
                description: c.description || c.descripcion || ''
            }));
            setCategories(normalizedCats);
            setUnidadesMedida(getArrayData(unidadesRes.data, 'unidadesmedida'));
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch data from the server.');
            setProducts([]);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { products, categories, unidadesMedida, isLoading, error, fetchData };
}
