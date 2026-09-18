import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Gasto, PagoData, PagoGasto } from './types';
import { getPago } from './types';

export function usePagoCrud(
    selectedGasto: Gasto | null,
    fetchPagos: (gastoid: number) => Promise<void>,
    fetchGastos: () => Promise<void>,
) {
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [editingPago, setEditingPago] = useState<PagoData | null>(null);
    const [pagoForm, setPagoForm] = useState({ monto: '', metodopago: 'efectivo', fecha: new Date().toISOString().split('T')[0] });

    const openPagoModal = () => {
        setEditingPago(null);
        setPagoForm({ monto: '', metodopago: 'efectivo', fecha: new Date().toISOString().split('T')[0] });
        setShowPagoModal(true);
    };

    const openEditPago = (pg: PagoGasto) => {
        const p = getPago(pg);
        setEditingPago(p);
        setPagoForm({
            monto: String(p.monto || ''),
            metodopago: p.metodopago || 'efectivo',
            fecha: p.fecha ? p.fecha.split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowPagoModal(true);
    };

    const handleDeletePago = async (pg: PagoGasto) => {
        const p = getPago(pg);
        const pagoid = p.pagoid ?? (p as any).id;
        const gastoid = selectedGasto?.gastoid ?? (selectedGasto as any)?.id;
        if (!pagoid || !gastoid) return;

        const result = await Swal.fire({
            title: '¿Eliminar este pago?',
            text: `Se eliminará el pago de C$ ${Number(p.monto || 0).toFixed(2)}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/pagos/${pagoid}`);
            fetchPagos(gastoid);
            fetchGastos(); // Refresh totals in the list
            Swal.fire({ icon: 'success', title: 'Pago eliminado', timer: 1500, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar el pago', 'error');
        }
    };

    const handleSavePago = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGasto) {
            Swal.fire('Error', 'Selecciona un gasto primero.', 'error');
            return;
        }
        const gastoid = selectedGasto.gastoid ?? (selectedGasto as any).id;
        if (!gastoid) {
            Swal.fire('Error', 'No se pudo determinar el ID del gasto. Por favor recarga la página e intenta de nuevo.', 'error');
            return;
        }
        const monto = Number(pagoForm.monto);
        if (!monto || monto <= 0) return Swal.fire('Aviso', 'Ingresa un monto válido', 'warning');
        try {
            if (editingPago) {
                const pagoid = editingPago.pagoid ?? (editingPago as any).id;
                await api.put(`/pagos/${pagoid}`, {
                    monto,
                    metodopago: pagoForm.metodopago,
                    fecha: pagoForm.fecha,
                    estado: true
                });
                setShowPagoModal(false);
                setEditingPago(null);
                fetchPagos(gastoid);
                fetchGastos(); // Refresh totals in the list
                Swal.fire({ icon: 'success', title: 'Pago actualizado', timer: 1500, showConfirmButton: false });
            } else {
                const pagoRes = await api.post('/pagos', {
                    monto,
                    metodopago: pagoForm.metodopago,
                    fecha: pagoForm.fecha,
                    estado: true,
                });
                const pagoData = pagoRes.data;
                const pagoid = pagoData?.pagoid
                    ?? pagoData?.id
                    ?? pagoData?.pago?.pagoid
                    ?? pagoData?.data?.pagoid;

                if (!pagoid) {
                    console.error('Respuesta del servidor al crear pago:', pagoData);
                    throw new Error('No se pudo obtener el ID del pago. Respuesta: ' + JSON.stringify(pagoData));
                }

                await api.post('/pago-gastos', { pagoid: Number(pagoid), gastoid: Number(gastoid) });

                setShowPagoModal(false);
                fetchPagos(gastoid);
                fetchGastos(); // Refresh totals in the list
                Swal.fire({ icon: 'success', title: 'Pago registrado', timer: 1500, showConfirmButton: false });
            }
        } catch (err: any) {
            Swal.fire('Error', err.message || err.response?.data?.error || 'No se pudo registrar el pago', 'error');
        }
    };

    return { showPagoModal, setShowPagoModal, editingPago, pagoForm, setPagoForm, openPagoModal, openEditPago, handleDeletePago, handleSavePago };
}
