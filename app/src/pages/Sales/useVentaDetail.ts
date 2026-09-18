import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import { getSaleClientName } from './types';
import type { Venta } from './types';

export function useVentaDetail(
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
    fetchData: () => Promise<void>,
) {
    const [showVentaDetalleModal, setShowVentaDetalleModal] = useState(false);
    const [ventaDetalleData, setVentaDetalleData] = useState<{ venta: any | null; productos: any[]; delivery?: any | null }>({ venta: null, productos: [], delivery: null });
    const [loadingVentaDetalle, setLoadingVentaDetalle] = useState(false);

    const handleVoidSale = async (id: number) => {
        const doVoid = async () => {
            const result = await Swal.fire({
                title: '¿Anular venta?', text: 'Esta acción revertirá el inventario y eliminará la venta.',
                icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444',
                confirmButtonText: 'Anular Venta', cancelButtonText: 'Cancelar',
            });
            if (result.isConfirmed) {
                try {
                    await api.delete(`/ventas/${id}`);
                    Swal.fire({ icon: 'success', title: 'Venta anulada con éxito', timer: 1500, showConfirmButton: false });
                    fetchData();
                } catch (err: any) {
                    Swal.fire('Error', err.response?.data?.error || 'No se pudo anular la venta.', 'error');
                }
            }
        };
        await requestAuth('ANULAR_VENTA', `Anular venta #${id}`, doVoid);
    };

    /* ── Exportar Detalle de Venta en PDF ── */
    const exportVentaDetallePDF = async (venta: Venta) => {
        const ventaId = venta.id ?? venta.ventaid;
        try {
            const [res, vdRes] = await Promise.all([
                api.get(`/venta-productos/venta/${ventaId}`),
                venta.lugarventa === 'DELIVERY' ? api.get(`/venta-delivery/venta/${ventaId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
            ]);
            const detalles: any[] = res.data || [];
            const clienteNombre = getSaleClientName(venta);

            // Fetch full delivery details if available
            let deliveryInfo: any = null;
            const vdList = getArrayData(vdRes.data);
            if (vdList.length > 0) {
                const deliveryId = vdList[0].deliveryid ?? vdList[0].id;
                if (deliveryId) {
                    try {
                        const dRes = await api.get(`/deliveries/${deliveryId}`);
                        deliveryInfo = dRes.data;
                    } catch { }
                }
            }

            const subtotalProductos = detalles.reduce((sum: number, d: any) => {
                const cant = Number(d.cantidad) || 0;
                const precio = Number(d.preciounitario) || 0;
                const desc = Number(d.descuento || 0);
                return sum + (cant * precio - desc);
            }, 0);

            const descuentoFactura = Number(venta.descuentofactura || 0);
            const totalVenta = Number(venta.total);

            // Calculate delivery cost
            let deliveryCost = 0;
            if (venta.lugarventa === 'DELIVERY') {
                if (deliveryInfo && deliveryInfo.costo != null) {
                    deliveryCost = Number(deliveryInfo.costo);
                } else {
                    deliveryCost = Math.max(0, totalVenta - Math.max(0, subtotalProductos - descuentoFactura));
                }
            }

            const printWindow = window.open('', '_blank');
            if (!printWindow) { Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Permita las ventanas emergentes.', 'error'); return; }

            const html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Venta #${ventaId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Outfit', sans-serif;
                        padding: 40px;
                        color: #1e293b;
                        background: #ffffff;
                        line-height: 1.5;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .report-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #f1f5f9;
                        padding-bottom: 20px;
                        margin-bottom: 24px;
                    }
                    .brand {
                        font-size: 24px;
                        font-weight: 700;
                        color: #4f46e5;
                        letter-spacing: -0.03em;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #0f172a;
                        letter-spacing: -0.02em;
                        margin-top: 4px;
                    }
                    .meta {
                        text-align: right;
                        font-size: 12px;
                        color: #64748b;
                    }
                    .meta-date {
                        font-weight: 600;
                        color: #0f172a;
                        font-size: 14px;
                    }
                    .details-card {
                        background: #f8fafc;
                        border: 1px solid #f1f5f9;
                        border-radius: 10px;
                        padding: 16px 20px;
                        margin-bottom: 24px;
                    }
                    .details-title {
                        font-size: 11px;
                        font-weight: 600;
                        color: #4f46e5;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 10px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                        font-size: 13.5px;
                    }
                    .details-grid div span {
                        color: #64748b;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        display: block;
                        margin-bottom: 2px;
                    }
                    .details-grid div strong {
                        color: #0f172a;
                        font-weight: 600;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 24px;
                    }
                    th {
                        font-size: 10.5px;
                        color: #475569;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        padding: 10px 8px;
                        border-bottom: 2px solid #e2e8f0;
                        text-align: left;
                        font-weight: 600;
                    }
                    td {
                        padding: 10px 8px;
                        font-size: 13px;
                        border-bottom: 1px solid #f1f5f9;
                        color: #334155;
                    }
                    .tabular-nums {
                        font-family: 'JetBrains Mono', monospace;
                        font-variant-numeric: tabular-nums;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .totals-section {
                        width: 320px;
                        margin-left: auto;
                        margin-top: 12px;
                        border-top: 2px solid #e2e8f0;
                        padding-top: 10px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 4px 0;
                        font-size: 13px;
                        color: #64748b;
                    }
                    .totals-row.grand-total {
                        font-size: 15px;
                        font-weight: 700;
                        color: #0f172a;
                        border-top: 1px solid #f1f5f9;
                        padding-top: 6px;
                        margin-top: 6px;
                    }
                    .report-footer {
                        border-top: 1px solid #e2e8f0;
                        padding-top: 14px;
                        margin-top: 40px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        color: #94a3b8;
                    }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <div>
                        <div class="brand">Ambienta POS</div>
                        <div class="title">${venta.consecutivofiscal ? 'Factura Fiscal' : 'Factura Comercial'}</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
                            ${venta.consecutivofiscal ? 'Consecutivo Fiscal' : venta.consecutivonofiscal ? 'Consecutivo Comercial' : 'Número de Venta'}
                        </div>
                        <div class="meta-date">${venta.consecutivofiscal || venta.consecutivonofiscal || `#${ventaId}`}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-title">Información del Cliente y Venta</div>
                    <div class="details-grid">
                        <div><span>Cliente</span><strong>${clienteNombre}</strong></div>
                        <div><span>Fecha</span><strong>${new Date(venta.fecha).toLocaleDateString('es-NI')}</strong></div>
                        <div><span>Tipo de Venta</span><strong>${venta.tipoventa}</strong></div>
                        <div><span>Método de Pago</span><strong style="text-transform: capitalize;">${venta.metodopago}</strong></div>
                        <div><span>Lugar de Venta</span><strong>${venta.lugarventa || 'NORMAL'}</strong></div>
                        <div><span>Tipo Comprobante</span><strong>${venta.consecutivofiscal ? `Fiscal (${venta.consecutivofiscal})` : venta.consecutivonofiscal ? `Comercial (${venta.consecutivonofiscal})` : 'Factura Comercial (Sin Consecutivo)'}</strong></div>
                        ${venta.lugarventa === 'DELIVERY' ? `
                            ${deliveryInfo?.repartidores?.nombre || deliveryInfo?.repartidornombre ? `<div><span>Repartidor</span><strong>${deliveryInfo.repartidores?.nombre || deliveryInfo.repartidornombre}</strong></div>` : ''}
                            ${deliveryInfo?.direccionentrega ? `<div style="grid-column: span 2;"><span>Dirección de Entrega</span><strong>${deliveryInfo.direccionentrega}</strong></div>` : ''}
                        ` : ''}
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Producto / Concepto</th>
                            <th class="text-center" style="width: 80px;">Cant.</th>
                            <th class="text-right" style="width: 120px;">Precio Unit.</th>
                            <th class="text-right" style="width: 100px;">Descuento</th>
                            <th class="text-right" style="width: 130px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detalles.map((d: any, i: number) => {
                const nombre = d.productonombre || d.productos?.nombre || d.nombre || `Producto #${d.productoid}`;
                const cant = Number(d.cantidad);
                const precio = Number(d.preciounitario);
                const desc = Number(d.descuento || 0);
                const sub = cant * precio - desc;
                return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td style="font-weight: 500; color: #0f172a;">${nombre}</td>
                                    <td class="tabular-nums text-center">${cant}</td>
                                    <td class="tabular-nums text-right">C$ ${precio.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td class="tabular-nums text-right">C$ ${desc.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td class="tabular-nums text-right" style="font-weight: 600; color: #0f172a;">C$ ${sub.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `;
            }).join('')}
                        ${venta.lugarventa === 'DELIVERY' && deliveryCost > 0 ? `
                            <tr style="background-color: #f8fafc; font-weight: 500;">
                                <td>${detalles.length + 1}</td>
                                <td style="font-weight: 600; color: #4f46e5;">🛵 Servicio de Delivery / Envío</td>
                                <td class="tabular-nums text-center">1</td>
                                <td class="tabular-nums text-right">C$ ${deliveryCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                <td class="tabular-nums text-right">C$ 0.00</td>
                                <td class="tabular-nums text-right" style="font-weight: 600; color: #4f46e5;">C$ ${deliveryCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>

                <div class="totals-section">
                    <div class="totals-row">
                        <span>Subtotal Productos</span>
                        <span class="tabular-nums">C$ ${subtotalProductos.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                    ${descuentoFactura > 0 ? `
                        <div class="totals-row" style="color: #dc2626;">
                            <span>Descuento Factura</span>
                            <span class="tabular-nums">- C$ ${descuentoFactura.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ` : ''}
                    ${venta.lugarventa === 'DELIVERY' && deliveryCost > 0 ? `
                        <div class="totals-row" style="color: #4f46e5; font-weight: 600;">
                            <span>Costo de Delivery</span>
                            <span class="tabular-nums">C$ ${deliveryCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ` : ''}
                    <div class="totals-row grand-total">
                        <span>Total a Pagar</span>
                        <span class="tabular-nums">C$ ${totalVenta.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div class="report-footer">
                    <span>Ambienta POS · Sistema de Ventas</span>
                    <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>`;

            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.onload = () => printWindow.print();
        } catch (err: any) {
            Swal.fire('Error', 'No se pudo cargar el detalle de la venta.', 'error');
        }
    };

    /* ── Abrir modal de detalle de venta ── */
    const openVentaDetalleModal = async (ventaId: number) => {
        setLoadingVentaDetalle(true);
        setShowVentaDetalleModal(true);
        try {
            const [ventaRes, productosRes] = await Promise.all([
                api.get(`/ventas/${ventaId}`),
                api.get(`/venta-productos/venta/${ventaId}`),
            ]);

            let delivery: any = null;
            if (ventaRes.data?.lugarventa === 'DELIVERY') {
                try {
                    const vdRes = await api.get(`/venta-delivery/venta/${ventaId}`);
                    const vdList = getArrayData(vdRes.data);
                    if (vdList.length > 0) {
                        const deliveryId = vdList[0].deliveryid ?? vdList[0].id;
                        if (deliveryId) {
                            const dRes = await api.get(`/deliveries/${deliveryId}`);
                            delivery = dRes.data;
                        }
                    }
                } catch { }
            }

            setVentaDetalleData({
                venta: ventaRes.data,
                productos: productosRes.data || [],
                delivery,
            });
        } catch {
            setVentaDetalleData({ venta: null, productos: [], delivery: null });
        } finally {
            setLoadingVentaDetalle(false);
        }
    };

    return {
        showVentaDetalleModal, setShowVentaDetalleModal,
        ventaDetalleData, loadingVentaDetalle,
        handleVoidSale, exportVentaDetallePDF, openVentaDetalleModal,
    };
}
