import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface ProfileForm {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    fotoperfil: string;
}

interface PasswordForm {
    contrasenaActual: string;
    contrasenaNueva: string;
    confirmarNueva: string;
}

export function useProfile() {
    const { user, token, permissions, login } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [correoVerificado, setCorreoVerificado] = useState(false);
    const [resending, setResending] = useState(false);

    const [form, setForm] = useState<ProfileForm>({ nombre: '', apellido: '', correo: '', telefono: '', fotoperfil: '' });
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({ contrasenaActual: '', contrasenaNueva: '', confirmarNueva: '' });

    useEffect(() => {
        api.get('/auth/profile')
            .then((res) => {
                const p = res.data;
                setForm({
                    nombre: p.nombre || '',
                    apellido: p.apellido || '',
                    correo: p.correo || '',
                    telefono: p.telefono || '',
                    fotoperfil: p.fotoperfil || '',
                });
                setCorreoVerificado(!!p.correoverificado);
            })
            .catch((err) => console.error('Error loading profile:', err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/auth/profile', form);
            Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });

            // Mantiene sincronizado el AuthContext (nombre mostrado en el Sidebar, etc.)
            if (token && user) {
                login(token, { ...user, nombre: res.data.nombre, correo: res.data.correo, fotoperfil: res.data.fotoperfil }, permissions);
            }
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo actualizar el perfil.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.contrasenaNueva !== passwordForm.confirmarNueva) {
            Swal.fire('Error', 'Las contraseñas nuevas no coinciden.', 'warning');
            return;
        }

        setChangingPassword(true);
        try {
            await api.put('/auth/profile', {
                contrasenaActual: passwordForm.contrasenaActual,
                contrasenaNueva: passwordForm.contrasenaNueva,
            });
            Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1500, showConfirmButton: false });
            setPasswordForm({ contrasenaActual: '', contrasenaNueva: '', confirmarNueva: '' });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo cambiar la contraseña.', 'error');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleResendVerification = async () => {
        setResending(true);
        try {
            await api.post('/auth/resend-verification');
            Swal.fire({ icon: 'success', title: 'Correo de verificación reenviado', timer: 1800, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo reenviar la verificación.', 'error');
        } finally {
            setResending(false);
        }
    };

    return {
        isLoading,
        form, setForm,
        saving, handleSaveProfile,
        passwordForm, setPasswordForm,
        changingPassword, handleChangePassword,
        correoVerificado, resending, handleResendVerification,
    };
}
