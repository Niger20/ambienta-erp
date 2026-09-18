import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Categoria, LineaCompra, Producto } from './types';

/**
 * Modal de registro rápido de producto (para códigos de barra desconocidos, ya sea
 * escaneados manualmente o importados desde Excel), más el modal de categoría en línea
 * que cuelga de él. Extraído verbatim de Purchases.tsx.
 */
export function useProductQuickCreate(
    setLineas: React.Dispatch<React.SetStateAction<LineaCompra[]>>,
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>,
) {
    const [showProductModal, setShowProductModal] = useState(false);
    const [pendingBarcode, setPendingBarcode] = useState('');
    const [productQueue, setProductQueue] = useState<string[]>([]);
    const [productForm, setProductForm] = useState({ nombre: '', preciocompra: '', precioventa: '', codigobarra: '', categoriaid: '', stockactual: '0', stockminimo: '0', descripcion: '' });

    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const [categoriaForm, setCategoriaForm] = useState({ nombre: '', descripcion: '' });

    /* ── Register new product from modal ── */
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: productForm.nombre,
                preciocompra: Number(productForm.preciocompra),
                precioventa: Number(productForm.precioventa),
                codigobarra: productForm.codigobarra,
                stockactual: Number(productForm.stockactual),
                stockminimo: Number(productForm.stockminimo),
                categoriaid: productForm.categoriaid ? Number(productForm.categoriaid) : undefined,
                descripcion: productForm.descripcion,
                estado: true,
            };
            const res = await api.post('/productos/', payload);
            const data = res.data;
            const newProduct: Producto = {
                id: data.id ?? data.productoid,
                nombre: data.nombre,
                codigobarra: data.codigobarra,
                preciocompra: Number(data.preciocompra),
                precioventa: Number(data.precioventa),
                stockactual: data.stockactual,
            };
            setLineas(prev => [...prev, { producto: newProduct, cantidad: 1, preciounitario: newProduct.preciocompra, descuento: 0 }]);
            setShowProductModal(false);
            setProductForm({ nombre: '', preciocompra: '', precioventa: '', codigobarra: '', categoriaid: '', stockactual: '0', stockminimo: '0', descripcion: '' });

            // Process next in queue if Excel import
            if (productQueue.length > 0) {
                const [next, ...rest] = productQueue;
                setProductQueue(rest);
                setPendingBarcode(next);
                setProductForm(p => ({ ...p, codigobarra: next, nombre: '' }));
                setShowProductModal(true);
            }
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el producto.', 'error');
        }
    };

    /* ── Guardar Categoría (inline from product registration) ── */
    const handleSaveCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoriaForm.nombre.trim()) return;
        try {
            const res = await api.post('/categoria-productos/', {
                nombre: categoriaForm.nombre,
                descripcion: categoriaForm.descripcion,
            });
            const newCat = res.data;
            const newCatId = newCat.id ?? newCat.categoriaid;
            setCategorias(prev => [...prev, { id: newCatId, nombre: newCat.nombre ?? newCat.name }]);
            setProductForm(p => ({ ...p, categoriaid: String(newCatId) }));
            setShowCategoriaModal(false);
            setCategoriaForm({ nombre: '', descripcion: '' });
            Swal.fire({ icon: 'success', title: 'Categoría creada', timer: 1500, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo crear la categoría.', 'error');
        }
    };

    return {
        showProductModal, setShowProductModal,
        pendingBarcode, setPendingBarcode,
        productQueue, setProductQueue,
        productForm, setProductForm,
        showCategoriaModal, setShowCategoriaModal,
        categoriaForm, setCategoriaForm,
        handleSaveProduct, handleSaveCategoria,
    };
}
