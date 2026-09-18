import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Repartidor } from './types';

export function useRepartidoresCrud(
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
) {
    const [showRepartidorModal, setShowRepartidorModal] = useState(false);
    const [isEditingRepartidor, setIsEditingRepartidor] = useState(false);
    const [repartidorForm, setRepartidorForm] = useState<Partial<Repartidor>>({});

    const openCreateRepartidor = () => {
        setIsEditingRepartidor(false);
        setRepartidorForm({ nombre: '', telefono: '' });
        setShowRepartidorModal(true);
    };

    const openEditRepartidor = (r: Repartidor) => {
        setIsEditingRepartidor(true);
        setRepartidorForm(r);
        setShowRepartidorModal(true);
    };

    const handleSaveRepartidor = async (e: React.FormEvent) => {
        e.preventDefault();
        const doSave = async () => {
            try {
                if (isEditingRepartidor) {
                    await api.put(`/repartidores/${repartidorForm.id || repartidorForm.repartidorid}`, repartidorForm);
                    Swal.fire({ icon: 'success', title: 'Repartidor actualizado', timer: 1500, showConfirmButton: false });
                } else {
                    await api.post('/repartidores', repartidorForm);
                    Swal.fire({ icon: 'success', title: 'Repartidor creado', timer: 1500, showConfirmButton: false });
                }
                setShowRepartidorModal(false);
                fetchData();
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'Error al guardar.', 'error');
            }
        };
        if (isEditingRepartidor) {
            await requestAuth('EDITAR_REPARTIDOR', `Editar repartidor ${repartidorForm.nombre || ''}`, doSave);
        } else {
            await doSave();
        }
    };

    const handleDeleteRepartidor = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar repartidor?',
            text: 'Se desactivará del sistema.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            await requestAuth('ELIMINAR_REPARTIDOR', `Eliminar repartidor #${id}`, async () => {
                try {
                    await api.delete(`/repartidores/${id}`);
                    Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
                    fetchData();
                } catch (err: any) {
                    Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar.', 'error');
                }
            });
        }
    };

    return {
        showRepartidorModal,
        setShowRepartidorModal,
        isEditingRepartidor,
        repartidorForm,
        setRepartidorForm,
        openCreateRepartidor,
        openEditRepartidor,
        handleSaveRepartidor,
        handleDeleteRepartidor,
    };
}
