import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Abono, ActiveTab, CuentaPorPagar } from './types';

export function useCuentasPorPagar(activeTab: ActiveTab, setIsLoading: (v: boolean) => void) {
    const [cuentasPorPagar, setCuentasPorPagar] = useState<CuentaPorPagar[]>([]);
    const [cuentaPagarSearchQuery, setCuentaPagarSearchQuery] = useState('');
    const [selectedCuentaPagar, setSelectedCuentaPagar] = useState<CuentaPorPagar | null>(null);
    const [abonos, setAbonos] = useState<Abono[]>([]);
    const [loadingAbonos, setLoadingAbonos] = useState(false);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [pagoForm, setPagoForm] = useState({ monto: '', metodopago: 'efectivo' });

    const fetchCuentasPorPagar = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/cuentas-por-pagar?limit=0');
            setCuentasPorPagar(getArrayData(res.data, 'cuentas'));
        } catch { setCuentasPorPagar([]); } finally { setIsLoading(false); }
    };

    useEffect(() => { if (activeTab === 'cuentas') fetchCuentasPorPagar(); }, [activeTab]);

    const fetchAbonos = async (cuentaid: number) => {
        setLoadingAbonos(true);
        try {
            const res = await api.get(`/pago-cuentas-por-pagar/cuenta-pagar/${cuentaid}`);
            const records = getArrayData(res.data, 'pagoCuentasPorPagar');
            const pagosPromise = records.map((r: any) => api.get(`/pagos/${r.pagoid}`).then(p => p.data.pago || p.data));
            const pagosDetalle = await Promise.all(pagosPromise);
            setAbonos(pagosDetalle);
        } catch {
            setAbonos([]);
        } finally {
            setLoadingAbonos(false);
        }
    };

    const openCuentaDetail = (cuenta: CuentaPorPagar) => {
        setSelectedCuentaPagar(cuenta);
        fetchAbonos(cuenta.id || cuenta.cuentapagarid!);
        setPagoForm({ monto: '', metodopago: 'efectivo' });
    };

    const handlePagarCuenta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCuentaPagar) return;
        const monto = Number(pagoForm.monto);
        if (!monto || monto <= 0) { Swal.fire('Error', 'Ingrese un monto válido.', 'error'); return; }
        try {
            // Create a pago and link to cuenta
            const pagoRes = await api.post('/pagos', { monto, metodopago: pagoForm.metodopago, estado: true });
            const pagoid = pagoRes.data.id ?? pagoRes.data.pagoid;
            const cuentaId = selectedCuentaPagar.id ?? selectedCuentaPagar.cuentapagarid;
            await api.post('/pago-cuentas-por-pagar', { pagoid, cuentapagarid: cuentaId });
            // Update cuenta
            const nuevoPagado = Number(selectedCuentaPagar.montopagado) + monto;
            const nuevoRestante = Number(selectedCuentaPagar.montototal) - nuevoPagado;
            await api.put(`/cuentas-por-pagar/${cuentaId}`, {
                montopagado: nuevoPagado,
                estado: nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE',
            });
            Swal.fire({ icon: 'success', title: 'Pago registrado', timer: 1200, showConfirmButton: false });
            setShowPagoModal(false);

            fetchCuentasPorPagar();
            if (cuentaId) {
                fetchAbonos(cuentaId);
                try {
                    const updatedRes = await api.get(`/cuentas-por-pagar/${cuentaId}`);
                    if (updatedRes.data) {
                        setSelectedCuentaPagar(updatedRes.data);
                    }
                } catch {
                    setSelectedCuentaPagar({ ...selectedCuentaPagar, montopagado: nuevoPagado, montorestante: Math.max(0, nuevoRestante), estado: nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE' });
                }
            }
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el pago.', 'error');
        }
    };

    const estadoColor = (estado: string) => {
        if (estado === 'PAGADO') return { color: 'var(--accent-success)', bg: 'var(--accent-success-bg)' };
        if (estado === 'VENCIDO') return { color: 'var(--accent-danger)', bg: 'var(--accent-danger-bg)' };
        return { color: 'var(--accent-warning)', bg: 'var(--accent-warning-bg)' };
    };

    // PDF historial de abonos
    const exportFacturaPDF = (cuenta: CuentaPorPagar, abonosList: Abono[]) => {
        const proveedor = cuenta.compras?.proveedores as any;
        const nombreProveedor = proveedor?.nombreempresa || `Proveedor Desconocido`;
        const telefonoProveedor = proveedor?.telefono || '—';

        const printContent = `
            <html>
            <head>
                <title>Historial de Pago - ${nombreProveedor}</title>
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
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    .details-title {
                        font-size: 11px;
                        font-weight: 600;
                        color: #4f46e5;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 8px;
                    }
                    .client-name {
                        font-size: 16px;
                        font-weight: 700;
                        color: #0f172a;
                        margin-bottom: 4px;
                    }
                    .client-detail {
                        font-size: 13px;
                        color: #4b5563;
                    }
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 4px 10px;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .badge-success {
                        background-color: #f0fdf4;
                        color: #15803d;
                        border: 1px solid #bbf7d0;
                    }
                    .badge-warning {
                        background-color: #fffbeb;
                        color: #b45309;
                        border: 1px solid #fde68a;
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
                        font-size: 13.5px;
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
                    .method-chip {
                        background: #f0f9ff;
                        color: #0284c7;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 10.5px;
                        font-weight: 600;
                        text-transform: uppercase;
                        border: 1px solid #bae6fd;
                    }
                    .totals-section {
                        width: 320px;
                        margin-left: auto;
                        margin-top: 16px;
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
                        <div class="title">Historial de Pago (CxP)</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Compra Asociada</div>
                        <div class="meta-date">#${cuenta.compraid || cuenta.id || cuenta.cuentapagarid}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div>
                        <div class="details-title">Datos del Proveedor</div>
                        <div class="client-name">${nombreProveedor}</div>
                        <div class="client-detail">Tel: ${telefonoProveedor}</div>
                    </div>
                    <div>
                        <span class="badge ${cuenta.estado === 'PAGADO' ? 'badge-success' : 'badge-warning'}">
                            ${cuenta.estado === 'PAGADO' ? 'CUENTA PAGADA' : 'PENDIENTE'}
                        </span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Fecha de Abono</th>
                            <th>Método de Pago</th>
                            <th class="text-right">Monto Abonado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${abonosList.map((a, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${new Date(a.fecha).toLocaleDateString('es-NI')}</td>
                                <td><span class="method-chip">${a.metodopago}</span></td>
                                <td class="tabular-nums text-right" style="font-weight: 600; color: #16a34a;">C$ ${Number(a.monto).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="totals-section">
                    <div class="totals-row">
                        <span>Monto Total de Compra</span>
                        <span class="tabular-nums">C$ ${Number(cuenta.montototal).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="totals-row">
                        <span>Total Abonado</span>
                        <span class="tabular-nums" style="color: #16a34a; font-weight: 500;">C$ ${abonosList.reduce((sum, a) => sum + Number(a.monto), 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="totals-row grand-total">
                        <span>Saldo Restante</span>
                        <span class="tabular-nums" style="color: #dc2626;">C$ ${Math.max(0, Number(cuenta.montototal) - abonosList.reduce((sum, a) => sum + Number(a.monto), 0)).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div class="report-footer">
                    <span>Sistema Ambienta POS · Historial generado</span>
                    <span>${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>
        `;
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(printContent);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 500);
        }
    };

    const filteredCuentasPorPagar = useMemo(() => {
        const query = cuentaPagarSearchQuery.trim().toLowerCase();
        if (!query) return cuentasPorPagar;
        return cuentasPorPagar.filter(c => {
            const provName = c.compras?.proveedores?.nombreempresa || '';
            return String(c.compraid).includes(query) ||
                provName.toLowerCase().includes(query);
        });
    }, [cuentasPorPagar, cuentaPagarSearchQuery]);

    return {
        cuentasPorPagar, cuentaPagarSearchQuery, setCuentaPagarSearchQuery, filteredCuentasPorPagar,
        selectedCuentaPagar, setSelectedCuentaPagar, abonos, loadingAbonos,
        showPagoModal, setShowPagoModal, pagoForm, setPagoForm,
        fetchCuentasPorPagar, openCuentaDetail, handlePagarCuenta, estadoColor, exportFacturaPDF,
    };
}
