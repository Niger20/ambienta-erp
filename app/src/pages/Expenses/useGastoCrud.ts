import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Gasto } from './types';

export function useGastoCrud(
    userId: string | number | undefined,
    fetchGastos: () => Promise<void>,
    selectedGasto: Gasto | null,
    setSelectedGasto: (g: Gasto | null) => void,
) {
    const [showGastoModal, setShowGastoModal] = useState(false);
    const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
    const [gastoForm, setGastoForm] = useState({ nombre: '', descripcion: '' });

    const openCreateGasto = () => {
        setEditingGasto(null);
        setGastoForm({ nombre: '', descripcion: '' });
        setShowGastoModal(true);
    };

    const openEditGasto = (g: Gasto) => {
        const normalized: Gasto = { ...g, gastoid: g.gastoid ?? (g as any).id };
        setEditingGasto(normalized);
        setGastoForm({ nombre: normalized.nombre, descripcion: normalized.descripcion || '' });
        setShowGastoModal(true);
    };

    const handleSaveGasto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gastoForm.nombre.trim()) return;
        try {
            if (editingGasto) {
                await api.put(`/gastos/${editingGasto.gastoid}`, { nombre: gastoForm.nombre, descripcion: gastoForm.descripcion });
            } else {
                await api.post('/gastos', { nombre: gastoForm.nombre, descripcion: gastoForm.descripcion, usuarioid: userId });
            }
            setShowGastoModal(false);
            fetchGastos();
            Swal.fire({ icon: 'success', title: editingGasto ? 'Gasto actualizado' : 'Gasto creado', timer: 1500, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo guardar el gasto', 'error');
        }
    };

    const handleDeleteGasto = async (g: Gasto) => {
        const gastoId = g.gastoid ?? (g as any).id;
        const result = await Swal.fire({
            title: `¿Eliminar "${g.nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;
        try {
            await api.delete(`/gastos/${gastoId}`);
            if ((selectedGasto?.gastoid ?? (selectedGasto as any)?.id) === gastoId) setSelectedGasto(null);
            fetchGastos();
            Swal.fire({ icon: 'success', title: 'Gasto eliminado', timer: 1500, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar', 'error');
        }
    };

    return { showGastoModal, setShowGastoModal, editingGasto, gastoForm, setGastoForm, openCreateGasto, openEditGasto, handleSaveGasto, handleDeleteGasto };
}
