import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import { getSaleClientName } from './types';
import type { Venta } from './types';

export function useCotizaciones(sales: Venta[], fetchData: () => Promise<void>) {
    const [cotizacionSearch, setCotizacionSearch] = useState('');
    const [showFacturarModal, setShowFacturarModal] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState<any | null>(null);
    const [cotizacionProductos, setCotizacionProductos] = useState<any[]>([]);
    const [loadingCotizacionDetalle, setLoadingCotizacionDetalle] = useState(false);
    const [facturarMetodoPago, setFacturarMetodoPago] = useState('efectivo');
    const [facturarTipoFactura, setFacturarTipoFactura] = useState<'FISCAL' | 'NO_FISCAL' | null>('FISCAL');
    const [facturarNumeroTransferencia, setFacturarNumeroTransferencia] = useState('');
    const [facturarFechaVencimientoCredito, setFacturarFechaVencimientoCredito] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });
    const [facturarMontoRecibido, setFacturarMontoRecibido] = useState('');
    const [isFacturando, setIsFacturando] = useState(false);

    const cotizacionesList = useMemo(() => {
        return sales.filter((sale: Venta) => {
            if (sale.tipoventa !== 'COTIZACION') return false;
            if (sale.estado === false) return false;
            const normalizedQuery = cotizacionSearch.trim().replace(/^#/, '').toLowerCase();
            if (!normalizedQuery) return true;
            const idStr = String(sale.id ?? sale.ventaid);
            return idStr.includes(normalizedQuery) || getSaleClientName(sale).toLowerCase().includes(normalizedQuery);
        });
    }, [sales, cotizacionSearch]);

    /* ── Cotizaciones Handlers ── */
    const openFacturarModal = async (cotizacion: Venta) => {
        const vid = cotizacion.id ?? cotizacion.ventaid;
        setSelectedCotizacion(cotizacion);
        setFacturarMetodoPago('efectivo');
        setFacturarTipoFactura('FISCAL');
        setFacturarNumeroTransferencia('');
        setFacturarMontoRecibido('');
        setLoadingCotizacionDetalle(true);
        setShowFacturarModal(true);
        try {
            const res = await api.get(`/venta-productos/venta/${vid}`);
            setCotizacionProductos(getArrayData(res.data, 'productos') || res.data || []);
        } catch {
            setCotizacionProductos([]);
        } finally {
            setLoadingCotizacionDetalle(false);
        }
    };

    const handleConfirmarFacturacion = async () => {
        if (!selectedCotizacion) return;
        const vid = selectedCotizacion.id ?? selectedCotizacion.ventaid;
        const totalVenta = Number(selectedCotizacion.total);

        if (['bac', 'lafise'].includes(facturarMetodoPago) && !facturarNumeroTransferencia.trim()) {
            Swal.fire('Error', 'Ingrese el número de transferencia bancaria.', 'error');
            return;
        }

        if (facturarMetodoPago === 'credito' && !selectedCotizacion.clienteid) {
            Swal.fire('Error', 'Para facturar al crédito la cotización debe tener un cliente asignado.', 'error');
            return;
        }

        setIsFacturando(true);
        try {
            // 1. Update tipoventa to CONTADO or CREDITO and assign tipofactura
            const tipoventa = facturarMetodoPago === 'credito' ? 'CREDITO' : 'CONTADO';
            const updatedVentaRes = await api.put(`/ventas/${vid}`, {
                tipoventa,
                tipofactura: facturarTipoFactura,
            });
            const updatedVenta = updatedVentaRes.data;

            // 2. Register ventapagos
            const isBanco = ['bac', 'lafise'].includes(facturarMetodoPago);
            await api.post('/venta-pagos', {
                ventaid: vid,
                metodopago: facturarMetodoPago.toUpperCase(),
                monto: totalVenta,
                banco: isBanco ? facturarMetodoPago.toUpperCase() : null,
                numerotransferencia: isBanco ? facturarNumeroTransferencia.trim() : null,
            });

            // 3. If credit, register cuenta por cobrar
            if (facturarMetodoPago === 'credito') {
                await api.post('/cuentas-por-cobrar', {
                    ventaid: vid,
                    clienteid: selectedCotizacion.clienteid,
                    montototal: totalVenta,
                    fechavencimiento: facturarFechaVencimientoCredito,
                    estado: 'PENDIENTE',
                });
            }

            const docLabel = updatedVenta?.consecutivofiscal
                ? `Factura Fiscal ${updatedVenta.consecutivofiscal}`
                : updatedVenta?.consecutivonofiscal
                    ? `Factura Comercial ${updatedVenta.consecutivonofiscal}`
                    : `Factura Comercial #${vid}`;

            Swal.fire({
                icon: 'success',
                title: '¡Cotización Facturada!',
                text: `La cotización #${vid} fue facturada exitosamente (${docLabel}).`,
                timer: 2500,
                showConfirmButton: false,
            });

            setShowFacturarModal(false);
            fetchData();
        } catch (err: any) {
            console.error("Error al facturar cotización:", err);
            const errMsg = err.response?.data?.error || err.message || 'No se pudo facturar la cotización.';
            Swal.fire('Error', errMsg, 'error');
        } finally {
            setIsFacturando(false);
        }
    };

    const handleAnularCotizacion = async (cotizacion: Venta) => {
        const vid = cotizacion.id ?? cotizacion.ventaid;
        const result = await Swal.fire({
            title: '¿Archivar / Anular Cotización?',
            text: `La cotización #${vid} quedará anulada y no podrá ser facturada.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            await api.put(`/ventas/${vid}`, { estado: false });
            Swal.fire({
                icon: 'success',
                title: 'Cotización Anulada',
                timer: 1500,
                showConfirmButton: false,
            });
            fetchData();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo anular la cotización.', 'error');
        }
    };

    return {
        cotizacionSearch, setCotizacionSearch, cotizacionesList,
        showFacturarModal, setShowFacturarModal,
        selectedCotizacion, cotizacionProductos, loadingCotizacionDetalle,
        facturarMetodoPago, setFacturarMetodoPago,
        facturarTipoFactura, setFacturarTipoFactura,
        facturarNumeroTransferencia, setFacturarNumeroTransferencia,
        facturarFechaVencimientoCredito, setFacturarFechaVencimientoCredito,
        facturarMontoRecibido, setFacturarMontoRecibido,
        isFacturando,
        openFacturarModal, handleConfirmarFacturacion, handleAnularCotizacion,
    };
}
