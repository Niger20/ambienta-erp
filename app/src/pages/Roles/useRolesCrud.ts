import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Rol, RolForm } from './types';

const emptyForm: RolForm = { id: undefined, nombre: '', descripcion: '', permisoIds: [] };

export function useRolesCrud(refetch: () => Promise<void>) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<RolForm>(emptyForm);

    const handleOpenCreate = () => {
        setForm(emptyForm);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleOpenEdit = (rol: Rol, permisoByCodigo: Record<string, number>) => {
        setForm({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion || '',
            permisoIds: rol.permisos.map((codigo) => permisoByCodigo[codigo]).filter((id) => id != null),
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && form.id) {
                await api.put(`/roles/${form.id}`, { nombre: form.nombre, descripcion: form.descripcion });
                await api.put(`/roles/${form.id}/permisos`, { permisoIds: form.permisoIds });
                Swal.fire({ icon: 'success', title: 'Rol actualizado', timer: 1500, showConfirmButton: false });
            } else {
                const res = await api.post('/roles', { nombre: form.nombre, descripcion: form.descripcion });
                const newRolId = res.data.id;
                if (form.permisoIds.length > 0) {
                    await api.put(`/roles/${newRolId}/permisos`, { permisoIds: form.permisoIds });
                }
                Swal.fire({ icon: 'success', title: 'Rol creado', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            await refetch();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar el rol', 'error');
        }
    };

    const handleDelete = async (rol: Rol) => {
        if (rol.essistema) {
            Swal.fire('Acción no permitida', 'Los roles de sistema no se pueden eliminar.', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: '¿Confirmar eliminación?',
            text: `El rol "${rol.nombre}" será eliminado permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Eliminar',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/roles/${rol.id}`);
                Swal.fire({ icon: 'success', title: 'Rol eliminado', timer: 1500, showConfirmButton: false });
                await refetch();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar el rol', 'error');
            }
        }
    };

    return {
        showModal, setShowModal,
        isEditing,
        form, setForm,
        handleOpenCreate,
        handleOpenEdit,
        handleSave,
        handleDelete,
    };
}
