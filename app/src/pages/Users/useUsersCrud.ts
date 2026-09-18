import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getArrayData } from '../../utils/arrayUtils';
import type { User, RolOption } from './types';

export function useUsersCrud() {
    const { user: currentUser, login, token, permissions } = useAuth();
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [roles, setRoles] = useState<RolOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        id: undefined as number | undefined,
        nombreusuario: '',
        contrasena: '',
        rolid: undefined as number | undefined,
    });

    const fetchAll = async () => {
        setIsLoading(true);
        try {
            const [usuariosRes, rolesRes] = await Promise.all([
                api.get('/auth/getUser'),
                api.get('/roles'),
            ]);
            setUsuarios(getArrayData<User>(usuariosRes.data, 'usuarios'));
            setRoles(getArrayData<RolOption>(rolesRes.data));
        } catch (error: any) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
            setUsuarios([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleOpenCreate = () => {
        const defaultRolId = roles.find((r) => r.nombre === 'empleado')?.id ?? roles[0]?.id;
        setForm({ id: undefined, nombreusuario: '', contrasena: '', rolid: defaultRolId });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleOpenEdit = (user: User) => {
        const currentRolId = user.rolid ?? roles.find((r) => r.nombre === user.rol)?.id;
        setForm({
            id: user.usuarioid || user.id,
            nombreusuario: user.nombreusuario,
            contrasena: '',
            rolid: currentRolId,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && form.id) {
                const payload: any = { nombreusuario: form.nombreusuario, rolid: form.rolid };
                if (form.contrasena.trim() !== '') {
                    payload.contrasenahash = form.contrasena;
                }
                await api.put(`/auth/updateUser/${form.id}`, payload);
                Swal.fire({ icon: 'success', title: 'Usuario actualizado', timer: 1500, showConfirmButton: false });

                // Si se editó el propio usuario logueado, sincronizar la sesión local
                const currentUid = Number(currentUser?.id);
                if (form.id === currentUid && token) {
                    const rolNombre = roles.find((r) => r.id === form.rolid)?.nombre || currentUser?.rol || '';
                    login(token, {
                        ...currentUser!,
                        id: form.id,
                        nombreusuario: form.nombreusuario,
                        rol: rolNombre,
                    }, permissions);
                }
            } else {
                if (!form.contrasena) return Swal.fire('Error', 'La contraseña es obligatoria', 'warning');
                await api.post('/auth/admin/register', {
                    nombreusuario: form.nombreusuario,
                    contrasena: form.contrasena,
                    rolid: form.rolid,
                });
                Swal.fire({ icon: 'success', title: 'Usuario creado', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            fetchAll();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar el usuario', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const currentUid = Number(currentUser?.id);
        if (id === currentUid) {
            Swal.fire('Acción no permitida', 'No puedes eliminar tu propia cuenta activa.', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: '¿Confirmar eliminación?',
            text: 'El usuario ya no podrá acceder al sistema',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Eliminar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/auth/deleteUser/${id}`);
                Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1500, showConfirmButton: false });
                fetchAll();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar el usuario', 'error');
            }
        }
    };

    return {
        currentUser,
        usuarios,
        roles,
        isLoading,
        showModal,
        setShowModal,
        isEditing,
        form,
        setForm,
        handleOpenCreate,
        handleOpenEdit,
        handleSave,
        handleDelete,
    };
}
