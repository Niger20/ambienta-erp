import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Proveedor, Producto, Categoria } from './types';

export function usePurchasesData() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productosCatalogo, setProductosCatalogo] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInitialData = async () => {
        try {
            const [provRes, catRes, prodRes] = await Promise.all([
                api.get('/proveedores?limit=0'),
                api.get('/categoria-productos?limit=0'),
                api.get('/productos?limit=0').catch(() => ({ data: [] })),
            ]);
            const prov = getArrayData(provRes.data, 'proveedores');
            setProveedores(prov.map((p: any) => ({ ...p, id: p.id ?? p.proveedorid })));
            const cats = getArrayData(catRes.data, 'categorias');
            setCategorias(cats.map((c: any) => ({ id: c.id ?? c.categoriaid, name: c.name ?? c.nombre })));
            const prods = getArrayData(prodRes.data, 'productos');
            setProductosCatalogo(prods.map((d: any) => ({
                id: Number(d.id ?? d.productoid),
                nombre: d.nombre,
                codigobarra: d.codigobarra,
                preciocompra: Number(d.preciocompra || 0),
                precioventa: Number(d.precioventa || 0),
                stockactual: d.stockactual,
                categorianombre: d.categorianombre ?? d.categoriasproductos?.nombre,
            })));
        } catch (err) { console.error(err); setProveedores([]); setCategorias([]); setProductosCatalogo([]); }
    };

    useEffect(() => { fetchInitialData(); }, []);

    return {
        proveedores, setProveedores,
        productosCatalogo,
        categorias, setCategorias,
        isLoading, setIsLoading,
        fetchInitialData,
    };
}
