import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { generateEAN13 } from './types';
import type { Category, Product } from './types';

const emptyForm = {
    nombre: '',
    preciocompra: '',
    precioventa: '',
    codigobarra: '',
    categoriaid: '',
    unidadmedidaid: '1',
    stockactual: '',
    stockminimo: '',
    descripcion: '',
    preciomayoreo: '',
    cantidadminimamayoreo: '',
    requierefechavencimiento: false,
    fechavencimiento: '',
    publicadoencatalogo: false,
};

export function useProductCrud(
    categories: Category[],
    unidadesMedida: any[],
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
    onRequestNewCategory: () => void,
) {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [productForm, setProductForm] = useState(emptyForm);

    const openCreateProductModal = () => {
        setIsEditingProduct(false);
        setEditingProductId(null);
        const autoCode = generateEAN13();
        setProductForm({
            nombre: '',
            preciocompra: '',
            precioventa: '',
            codigobarra: autoCode,
            categoriaid: categories[0]?.id ? String(categories[0].id) : '',
            unidadmedidaid: unidadesMedida[0]?.unidadmedidaid || unidadesMedida[0]?.id ? String(unidadesMedida[0].unidadmedidaid || unidadesMedida[0].id) : '1',
            stockactual: '0',
            stockminimo: '5',
            descripcion: '',
            preciomayoreo: '',
            cantidadminimamayoreo: '',
            requierefechavencimiento: false,
            fechavencimiento: '',
            publicadoencatalogo: false,
        });
        setIsProductModalOpen(true);
    };

    const editProduct = (product: Product) => {
        setIsEditingProduct(true);
        setEditingProductId(product.id);
        setProductForm({
            nombre: product.nombre || '',
            preciocompra: product.preciocompra ? String(product.preciocompra) : '',
            precioventa: product.precioventa ? String(product.precioventa) : '',
            codigobarra: product.codigobarra || '',
            categoriaid: product.categoriaid ? String(product.categoriaid) : '',
            unidadmedidaid: product.unidadmedidaid ? String(product.unidadmedidaid) : '1',
            stockactual: product.stockactual !== undefined ? String(product.stockactual) : '',
            stockminimo: product.stockminimo !== undefined ? String(product.stockminimo) : '',
            descripcion: product.descripcion || '',
            preciomayoreo: product.preciomayoreo ? String(product.preciomayoreo) : '',
            cantidadminimamayoreo: product.cantidadminimamayoreo ? String(product.cantidadminimamayoreo) : '',
            requierefechavencimiento: Boolean(product.requierefechavencimiento),
            fechavencimiento: product.fechavencimiento ? String(product.fechavencimiento).split('T')[0] : '',
            publicadoencatalogo: Boolean(product.publicadoencatalogo),
        });
        setIsProductModalOpen(true);
    };

    const deleteProduct = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        await requestAuth('ELIMINAR_PRODUCTO', `Eliminar producto #${id}`, async () => {
            try {
                await api.delete(`/productos/${id}`);
                Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
                fetchData();
            } catch (err) {
                console.error("Failed to delete product", err);
                Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            }
        });
    };

    const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (name === 'categoriaid' && value === 'NEW') {
            onRequestNewCategory();
            return;
        }

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setProductForm(prev => ({ ...prev, [name]: checked }));
            return;
        }

        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextField = document.getElementById('product-name-input');
            if (nextField) nextField.focus();
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasMayoreoPrice = productForm.preciomayoreo !== '' && productForm.preciomayoreo !== null && !isNaN(Number(productForm.preciomayoreo));
        const hasMayoreoCant = productForm.cantidadminimamayoreo !== '' && productForm.cantidadminimamayoreo !== null && !isNaN(Number(productForm.cantidadminimamayoreo));

        if ((hasMayoreoPrice && !hasMayoreoCant) || (!hasMayoreoPrice && hasMayoreoCant)) {
            Swal.fire('Atención', 'Si especifica un precio de mayoreo, debe indicar la cantidad mínima requerida (y viceversa).', 'warning');
            return;
        }

        const doSave = async () => {
            try {
                const finalBarcode = productForm.codigobarra?.trim() ? productForm.codigobarra.trim() : generateEAN13();
                const payload: any = {
                    nombre: productForm.nombre.trim(),
                    preciocompra: Number(productForm.preciocompra),
                    precioventa: Number(productForm.precioventa),
                    codigobarra: finalBarcode,
                    stockactual: isEditingProduct ? Number(productForm.stockactual || 0) : 0,
                    stockminimo: Number(productForm.stockminimo || 0),
                    categoriaid: productForm.categoriaid ? Number(productForm.categoriaid) : null,
                    unidadmedidaid: productForm.unidadmedidaid ? Number(productForm.unidadmedidaid) : 1,
                    descripcion: productForm.descripcion || null,
                    preciomayoreo: hasMayoreoPrice ? Number(productForm.preciomayoreo) : null,
                    cantidadminimamayoreo: hasMayoreoCant ? Number(productForm.cantidadminimamayoreo) : null,
                    requierefechavencimiento: Boolean(productForm.requierefechavencimiento),
                    fechavencimiento: productForm.fechavencimiento ? new Date(productForm.fechavencimiento).toISOString() : null,
                    publicadoencatalogo: Boolean(productForm.publicadoencatalogo),
                };

                if (isEditingProduct && editingProductId) {
                    await api.put(`/productos/${editingProductId}`, payload);
                } else {
                    await api.post('/productos/', payload);
                }
                setIsProductModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: isEditingProduct ? 'Producto actualizado' : 'Producto creado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchData();
            } catch (err: any) {
                console.error("Failed to save product", err);
                const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message || JSON.stringify(err);
                Swal.fire('Error', 'No se pudo guardar el producto:<br/>' + serverMsg, 'error');
            }
        };

        if (isEditingProduct) {
            await requestAuth('EDITAR_PRODUCTO', `Editar producto #${editingProductId}`, doSave);
        } else {
            await doSave();
        }
    };

    return {
        isProductModalOpen, setIsProductModalOpen,
        isEditingProduct, editingProductId,
        productForm, setProductForm,
        openCreateProductModal, editProduct, deleteProduct,
        handleProductInputChange, handleBarcodeKeyDown, handleCreateProduct,
    };
}
