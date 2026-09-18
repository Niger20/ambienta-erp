import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Cliente } from './types';

export function useCustomerCrud(
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
    fetchData: () => Promise<void>,
) {
    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
    const [customerForm, setCustomerForm] = useState<Partial<Cliente>>({});
    const [savingCustomer, setSavingCustomer] = useState(false);

    const handleEditCustomer = (customer: Cliente) => {
        setCustomerForm(customer);
        setShowEditCustomerModal(true);
    };

    const openCreateCustomerModal = () => {
        setCustomerForm({
            nombre: '',
            cedula: '',
            telefono: '',
            limitecredito: 0,
            direccion: '',
            estado: true
        });
        setShowEditCustomerModal(true);
    };

    const handleSaveCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = !!customerForm.id;
        const cleanTelefono = customerForm.telefono && customerForm.telefono.trim() ? customerForm.telefono.replace(/\D/g, '') : null;
        const cleanCedula = customerForm.cedula && customerForm.cedula.trim() ? customerForm.cedula.trim() : null;
        const payload = {
            ...customerForm,
            telefono: cleanTelefono,
            cedula: cleanCedula,
            limitecredito: customerForm.limitecredito != null && (customerForm.limitecredito as any) !== '' ? Number(customerForm.limitecredito) : null
        };

        const doSave = async () => {
            setSavingCustomer(true);
            try {
                if (isEdit) {
                    await api.put(`/clientes/${customerForm.id}`, payload);
                    Swal.fire({ icon: 'success', title: 'Cliente actualizado', timer: 1500, showConfirmButton: false });
                } else {
                    await api.post('/clientes', payload);
                    Swal.fire({ icon: 'success', title: 'Cliente registrado', timer: 1500, showConfirmButton: false });
                }
                setShowEditCustomerModal(false);
                fetchData();
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'No se pudo guardar el cliente.', 'error');
            } finally { setSavingCustomer(false); }
        };

        if (isEdit) {
            await requestAuth('EDITAR_CLIENTE', `Editar cliente #${customerForm.id}`, doSave);
        } else {
            await doSave();
        }
    };

    const handleDeleteCustomer = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar cliente?', text: 'Esta acción no se puede deshacer.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444',
            confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        await requestAuth('ELIMINAR_CLIENTE', `Eliminar cliente #${id}`, async () => {
            try {
                await api.delete(`/clientes/${id}`);
                Swal.fire({ icon: 'success', title: 'Cliente eliminado', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar el cliente.', 'error');
            }
        });
    };

    return {
        showEditCustomerModal, setShowEditCustomerModal,
        customerForm, setCustomerForm, savingCustomer,
        handleEditCustomer, openCreateCustomerModal, handleSaveCustomer, handleDeleteCustomer,
    };
}
