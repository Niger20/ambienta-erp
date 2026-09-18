import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Category } from './types';

export function useCategoryCrud(
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
    onCategoryCreated: (categoryId: string) => void,
) {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '' });

    const openCreateCategoryModal = () => {
        setIsEditingCategory(false);
        setEditingCategoryId(null);
        setCategoryForm({ nombre: '', descripcion: '' });
        setIsCategoryModalOpen(true);
    };

    const editCategory = (category: Category) => {
        setIsEditingCategory(true);
        setEditingCategoryId(category.id);
        setCategoryForm({
            nombre: category.name || '',
            descripcion: category.description || ''
        });
        setIsCategoryModalOpen(true);
    };

    const deleteCategory = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar categoría?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        await requestAuth('ELIMINAR_CATEGORIA', `Eliminar categoría #${id}`, async () => {
            try {
                await api.delete(`/categoria-productos/${id}`);
                Swal.fire('Eliminada!', 'La categoría ha sido eliminada.', 'success');
                fetchData();
            } catch (err) {
                console.error("Failed to delete category", err);
                Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
            }
        });
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const doSave = async () => {
            try {
                let res;
                if (isEditingCategory && editingCategoryId) {
                    res = await api.put(`/categoria-productos/${editingCategoryId}`, categoryForm);
                } else {
                    res = await api.post('/categoria-productos/', categoryForm);
                }
                const savedCategory = res.data;
                if (!isEditingCategory) {
                    onCategoryCreated(String(savedCategory.id));
                }
                setCategoryForm({ nombre: '', descripcion: '' });
                setIsCategoryModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: isEditingCategory ? 'Categoría actualizada' : 'Categoría creada',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchData();
            } catch (err) {
                console.error("Failed to save category", err);
                Swal.fire('Error', 'No se pudo guardar la categoría.', 'error');
            }
        };

        if (isEditingCategory) {
            await requestAuth('EDITAR_CATEGORIA', `Editar categoría #${editingCategoryId}`, doSave);
        } else {
            await doSave();
        }
    };

    return {
        isCategoryModalOpen, setIsCategoryModalOpen,
        isEditingCategory, editingCategoryId,
        categoryForm, setCategoryForm,
        openCreateCategoryModal, editCategory, deleteCategory, handleCreateCategory,
    };
}
