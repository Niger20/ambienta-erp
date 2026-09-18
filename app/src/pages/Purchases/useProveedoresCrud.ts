import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Proveedor } from './types';

export function useProveedoresCrud(
    proveedores: Proveedor[],
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
    fetchInitialData: () => Promise<void>,
    setSelectedProveedor: (id: string) => void,
) {
    const [proveedorStatusFilter, setProveedorStatusFilter] = useState('active');
    const [proveedorSearchQuery, setProveedorSearchQuery] = useState('');
    const [showProveedorModal, setShowProveedorModal] = useState(false);
    const [isEditingProveedor, setIsEditingProveedor] = useState(false);
    const [editProveedorId, setEditProveedorId] = useState<number | null>(null);
    const [proveedorForm, setProveedorForm] = useState({ nombreempresa: '', asesorventas: '', telefono: '', direccion: '', clasificacion: '' });

    const openCreateProveedor = () => {
        setIsEditingProveedor(false);
        setEditProveedorId(null);
        setProveedorForm({ nombreempresa: '', asesorventas: '', telefono: '', direccion: '', clasificacion: '' });
        setShowProveedorModal(true);
    };

    const openEditProveedor = (p: Proveedor) => {
        setIsEditingProveedor(true);
        setEditProveedorId(p.id ?? p.proveedorid ?? null);
        setProveedorForm({ nombreempresa: p.nombreempresa, asesorventas: p.asesorventas, telefono: p.telefono || '', direccion: p.direccion || '', clasificacion: p.clasificacion || '' });
        setShowProveedorModal(true);
    };

    const handleSaveProveedor = async (e: React.FormEvent) => {
        e.preventDefault();
        const doSave = async () => {
            try {
                if (isEditingProveedor && editProveedorId) {
                    await api.put(`/proveedores/${editProveedorId}`, proveedorForm);
                    Swal.fire({ icon: 'success', title: 'Proveedor actualizado', timer: 1200, showConfirmButton: false });
                    setShowProveedorModal(false);
                    fetchInitialData();
                } else {
                    const res = await api.post('/proveedores', proveedorForm);
                    const nProv = res.data;
                    const id = nProv.id || nProv.proveedorid;
                    if (id) setSelectedProveedor(id.toString());
                    Swal.fire({ icon: 'success', title: 'Proveedor creado', timer: 1200, showConfirmButton: false });
                    setShowProveedorModal(false);
                    fetchInitialData();
                }
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'No se pudo guardar el proveedor.', 'error');
            }
        };
        if (isEditingProveedor) {
            await requestAuth('EDITAR_PROVEEDOR', `Editar proveedor #${editProveedorId}`, doSave);
        } else {
            await doSave();
        }
    };

    const deleteProveedor = async (id: number) => {
        const { isConfirmed } = await Swal.fire({ title: '¿Eliminar proveedor?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar', confirmButtonColor: '#ef4444' });
        if (!isConfirmed) return;
        await requestAuth('ELIMINAR_PROVEEDOR', `Eliminar proveedor #${id}`, async () => {
            try {
                await api.delete(`/proveedores/${id}`);
                fetchInitialData();
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar el proveedor.', 'error');
            }
        });
    };

    const filteredProveedores = useMemo(() => {
        const query = proveedorSearchQuery.trim().toLowerCase();
        return proveedores.filter(p => {
            const matchesStatus = proveedorStatusFilter === 'active' ? (p as any).estado !== false : (p as any).estado === false;
            if (!query) return matchesStatus;
            const matchesSearch = p.nombreempresa.toLowerCase().includes(query) ||
                (p.asesorventas || '').toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [proveedores, proveedorStatusFilter, proveedorSearchQuery]);

    return {
        proveedorStatusFilter, setProveedorStatusFilter,
        proveedorSearchQuery, setProveedorSearchQuery,
        filteredProveedores,
        showProveedorModal, setShowProveedorModal,
        isEditingProveedor, proveedorForm, setProveedorForm,
        openCreateProveedor, openEditProveedor, handleSaveProveedor, deleteProveedor,
    };
}
