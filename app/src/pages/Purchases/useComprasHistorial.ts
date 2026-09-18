import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Compra, ActiveTab } from './types';

const COMPRAS_ITEMS_PER_PAGE = 25;

export function useComprasHistorial(
    activeTab: ActiveTab,
    setIsLoading: (v: boolean) => void,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
) {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [comprasAnuladas, setComprasAnuladas] = useState<Compra[]>([]);
    const [compraStatusFilter, setCompraStatusFilter] = useState('active');
    const [compraSearchQuery, setCompraSearchQuery] = useState('');
    const [compraPage, setCompraPage] = useState(1);

    const fetchCompras = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/compras?limit=0');
            setCompras(getArrayData(res.data, 'compras').map((c: any) => ({ ...c, id: c.id ?? c.compraid })));
        } catch { setCompras([]); } finally { setIsLoading(false); }
    };

    const fetchComprasAnuladas = async () => {
        try {
            const res = await api.get('/compras/deactivated?limit=0');
            setComprasAnuladas(getArrayData(res.data, 'compras').map((c: any) => ({ ...c, id: c.id ?? c.compraid, _anulada: true })));
        } catch { setComprasAnuladas([]); }
    };

    useEffect(() => { setCompraPage(1); }, [compraSearchQuery, compraStatusFilter]);
    useEffect(() => { if (activeTab === 'history') fetchCompras(); }, [activeTab]);
    useEffect(() => { if (compraStatusFilter === 'inactive') fetchComprasAnuladas(); }, [compraStatusFilter]);

    const handleVoidCompra = async (id: number) => {
        const doVoid = async () => {
            const result = await Swal.fire({
                title: '¿Anular compra?',
                text: 'Esta acción revertirá el inventario y eliminará la compra. No se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Anular Compra'
            });
            if (result.isConfirmed) {
                try {
                    await api.delete(`/compras/${id}`);
                    Swal.fire({ icon: 'success', title: 'Compra anulada', timer: 1500, showConfirmButton: false });
                    fetchCompras();
                } catch (err: any) {
                    Swal.fire('Error', err.response?.data?.error || 'No se pudo anular la compra.', 'error');
                }
            }
        };
        await requestAuth('ANULAR_COMPRA', `Anular compra #${id}`, doVoid);
    };

    /* ── Exportar Detalle de Compra en PDF ── */
    const exportCompraDetallePDF = async (compra: Compra) => {
        const compraId = compra.id ?? compra.compraid;
        try {
            const [resDetalles, resCostos] = await Promise.all([
                api.get(`/compras-productos/compra/${compraId}`),
                api.get(`/costos-adicionales-compras?compraid=${compraId}&limit=0`).catch(() => ({ data: [] })),
            ]);
            const detalles: any[] = resDetalles.data || [];
            const costosAdicionalesCompra: any[] = getArrayData(resCostos.data, 'costos');
            const totalAdicionales = costosAdicionalesCompra.reduce((sum: number, c: any) => sum + Number(c.monto || 0), 0);

            const printWindow = window.open('', '_blank');
            if (!printWindow) { Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Permita las ventanas emergentes.', 'error'); return; }

            const html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Compra #${compraId}</title>
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
                        <div class="title">Detalle de Compra</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Número de Compra</div>
                        <div class="meta-date">#${compraId}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-title">Información de la Compra</div>
                    <div class="details-grid">
                        <div><span>Proveedor</span><strong>${compra.proveedores?.nombreempresa || 'N/A'}</strong></div>
                        <div><span>Fecha</span><strong>${new Date(compra.fecha).toLocaleDateString('es-NI')}</strong></div>
                        <div><span>Tipo</span><strong>${compra.tipocompra}</strong></div>
                        <div><span>Método de Pago</span><strong style="text-transform: capitalize;">${compra.metodopago}</strong></div>
                        ${compra.facturaproveedor ? `<div><span>Factura Proveedor</span><strong>${compra.facturaproveedor}</strong></div>` : ''}
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Producto</th>
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
                    </tbody>
                </table>

                ${costosAdicionalesCompra.length > 0 ? `
                    <div style="font-size: 12px; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin-bottom: 6px;">Costos Adicionales de Adquisición (Landed Costs)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Concepto</th>
                                <th class="text-right" style="width: 130px;">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${costosAdicionalesCompra.map((c: any) => `
                                <tr>
                                    <td>${c.concepto}</td>
                                    <td class="tabular-nums text-right">C$ ${Number(c.monto).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : ''}

                <div class="totals-section">
                    <div class="totals-row">
                        <span>Total Factura Productos</span>
                        <span class="tabular-nums">C$ ${Number(compra.total).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                    ${totalAdicionales > 0 ? `
                        <div class="totals-row" style="color: #4f46e5;">
                            <span>Costos Adicionales</span>
                            <span class="tabular-nums">+ C$ ${totalAdicionales.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ` : ''}
                    <div class="totals-row grand-total">
                        <span>Costo Total Adquisición</span>
                        <span class="tabular-nums">C$ ${(Number(compra.total) + totalAdicionales).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div class="report-footer">
                    <span>Ambienta POS · Control de Compras</span>
                    <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>`;

            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.onload = () => printWindow.print();
        } catch (err: any) {
            Swal.fire('Error', 'No se pudo cargar el detalle de la compra.', 'error');
        }
    };

    const filteredCompras = useMemo(() => {
        const baseCompras = compraStatusFilter === 'inactive' ? comprasAnuladas : compras;
        const query = compraSearchQuery.trim().toLowerCase();
        if (!query) return baseCompras;
        return baseCompras.filter(c => {
            return String(c.id ?? c.compraid).includes(query) ||
                (c.proveedores?.nombreempresa || '').toLowerCase().includes(query);
        });
    }, [compraStatusFilter, comprasAnuladas, compras, compraSearchQuery]);

    const totalCompraPages = Math.ceil(filteredCompras.length / COMPRAS_ITEMS_PER_PAGE);
    const paginatedCompras = useMemo(() => {
        const offset = (compraPage - 1) * COMPRAS_ITEMS_PER_PAGE;
        return filteredCompras.slice(offset, offset + COMPRAS_ITEMS_PER_PAGE);
    }, [filteredCompras, compraPage]);

    return {
        compras, comprasAnuladas, compraStatusFilter, setCompraStatusFilter,
        compraSearchQuery, setCompraSearchQuery, compraPage, setCompraPage,
        fetchCompras, fetchComprasAnuladas,
        handleVoidCompra, exportCompraDetallePDF,
        filteredCompras, totalCompraPages, paginatedCompras,
    };
}
