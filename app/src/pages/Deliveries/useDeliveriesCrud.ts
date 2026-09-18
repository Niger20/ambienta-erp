import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';

export function useDeliveriesCrud(fetchData: () => Promise<void>) {
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState({ repartidorid: '', direccionentrega: '', costo: '' });

    const openCreateDelivery = () => {
        setDeliveryForm({ repartidorid: '', direccionentrega: '', costo: '' });
        setShowDeliveryModal(true);
    };

    const handleSaveDelivery = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/deliveries', {
                repartidorid: Number(deliveryForm.repartidorid),
                direccionentrega: deliveryForm.direccionentrega,
                costo: Number(deliveryForm.costo),
                estado: true,
            });
            Swal.fire({ icon: 'success', title: 'Entrega registrada', timer: 1500, showConfirmButton: false });
            setShowDeliveryModal(false);
            fetchData();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'Error al guardar entrega.', 'error');
        }
    };

    const finalizeDelivery = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Finalizar entrega?',
            text: 'Se marcará como completada/archivada.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/deliveries/${id}`);
                Swal.fire({ icon: 'success', title: 'Entrega finalizada', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.error || 'Error al finalizar.', 'error');
            }
        }
    };

    return { showDeliveryModal, setShowDeliveryModal, deliveryForm, setDeliveryForm, openCreateDelivery, handleSaveDelivery, finalizeDelivery };
}
