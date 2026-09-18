import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getArrayData } from '../../utils/arrayUtils';
import type { User } from './types';

export function useUsersCrud() {
    const { user: currentUser, login, token } = useAuth();
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        id: undefined as number | undefined,
        nombreusuario: '',
        contrasena: '',
        rol: 'empleado'
    });

    const fetchUsuarios = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/auth/getUser');
            const data = getArrayData<User>(res.data, 'usuarios');
            setUsuarios(data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
            setUsuarios([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleOpenCreate = () => {
        setForm({ id: undefined, nombreusuario: '', contrasena: '', rol: 'empleado' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleOpenEdit = (user: User) => {
        setForm({
            id: user.usuarioid || user.id,
            nombreusuario: user.nombreusuario,
            contrasena: '',
            rol: user.rol || 'empleado'
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && form.id) {
                const payload: any = { nombreusuario: form.nombreusuario, rol: form.rol };
                if (form.contrasena.trim() !== '') {
                    payload.contrasenahash = form.contrasena;
                }
                await api.put(`/auth/updateUser/${form.id}`, payload);
                Swal.fire({ icon: 'success', title: 'Usuario actualizado', timer: 1500, showConfirmButton: false });

                // Si se editó el propio usuario logueado, sincronizar la sesión local
                const currentUid = Number(currentUser?.id);
                if (form.id === currentUid && token) {
                    login(token, {
                        id: form.id,
                        nombreusuario: form.nombreusuario,
                        rol: form.rol
                    });
                }
            } else {
                if (!form.contrasena) return Swal.fire('Error', 'La contraseña es obligatoria', 'warning');
                await api.post('/auth/register', {
                    nombreusuario: form.nombreusuario,
                    contrasenahash: form.contrasena,
                    rol: form.rol
                });
                Swal.fire({ icon: 'success', title: 'Usuario creado', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            fetchUsuarios();
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
                fetchUsuarios();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar el usuario', 'error');
            }
        }
    };

    return {
        currentUser,
        usuarios,
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
