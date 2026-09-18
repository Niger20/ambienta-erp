import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Cliente, CuentaPorCobrar, Abono } from './types';

export function useCuentasPorCobrar(customers: Cliente[], activeTab: string) {
    const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>([]);
    const [cuentaSearchQuery, setCuentaSearchQuery] = useState('');

    // Cuentas state
    const [selectedCuenta, setSelectedCuenta] = useState<CuentaPorCobrar | null>(null);
    const [abonos, setAbonos] = useState<Abono[]>([]);
    const [loadingAbonos, setLoadingAbonos] = useState(false);
    const [showAbonoModal, setShowAbonoModal] = useState(false);
    const [abonoForm, setAbonoForm] = useState({ monto: '', metodopago: 'efectivo' });
    const [savingAbono, setSavingAbono] = useState(false);
    const [cuentaSortBy] = useState('cliente');
    const [cuentaSortOrder] = useState('asc');
    const [expandedClientId, setExpandedClientId] = useState<number | null>(null);

    // Global Abono State
    const [showGlobalAbonoModal, setShowGlobalAbonoModal] = useState(false);
    const [globalAbonoForm, setGlobalAbonoForm] = useState({ monto: '', metodopago: 'efectivo' });
    const [globalAbonoClientInfo, setGlobalAbonoClientInfo] = useState<{ id: number, nombre: string, totalRestante: number } | null>(null);
    const [savingGlobalAbono, setSavingGlobalAbono] = useState(false);

    // Sort state for cuentas within each client
    const [cuentasSortField, setCuentasSortField] = useState<'fechavencimiento' | 'ventaid'>('fechavencimiento');
    const [cuentasSortDirection, setCuentasSortDirection] = useState<'asc' | 'desc'>('desc');
    const [cuentasPages, setCuentasPages] = useState<Record<number, number>>({});

    useEffect(() => { if (activeTab === 'cuentas') fetchCuentas(); }, [activeTab]);

    const fetchCuentas = async () => {
        try {
            const res = await api.get('/cuentas-por-cobrar?limit=0');
            setCuentas(getArrayData(res.data, 'cuentas'));
        } catch (err) { console.error(err); setCuentas([]); }
    };

    const fetchAbonos = async (cuentaid: number) => {
        setLoadingAbonos(true);
        try {
            const res = await api.get(`/abonos/cuenta/${cuentaid}`);
            setAbonos(getArrayData(res.data, 'abonos'));
        } catch { setAbonos([]); }
        finally { setLoadingAbonos(false); }
    };

    const openCuentaDetail = (cuenta: CuentaPorCobrar) => {
        setSelectedCuenta(cuenta);
        fetchAbonos(cuenta.id || cuenta.cuentaid!);
        setAbonoForm({ monto: '', metodopago: 'efectivo' });
    };

    const getClienteForCuenta = (cuenta: CuentaPorCobrar): Cliente | undefined => {
        return customers.find(c => c.id === cuenta.clienteid);
    };

    const handleRegistrarAbono = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCuenta) return;
        const monto = Number(abonoForm.monto);
        if (!monto || monto <= 0) { Swal.fire('Error', 'Ingrese un monto válido.', 'error'); return; }
        const montoRestante = Number(selectedCuenta.montorestante);
        if (monto > montoRestante) {
            Swal.fire('Error', `El monto no puede superar el saldo restante (C$ ${montoRestante.toFixed(2)}).`, 'error');
            return;
        }
        setSavingAbono(true);
        try {
            await api.post('/abonos', {
                cuentaid: selectedCuenta.id || selectedCuenta.cuentaid,
                monto,
                metodopago: abonoForm.metodopago,
            });
            const nuevoRestante = montoRestante - monto;
            const nuevoEstado = nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE';
            await api.put(`/cuentas-por-cobrar/${selectedCuenta.id || selectedCuenta.cuentaid}`, {
                montopagado: Number(selectedCuenta.montopagado) + monto,
                estado: nuevoEstado,
            });
            Swal.fire({ icon: 'success', title: 'Abono registrado', timer: 1500, showConfirmButton: false });
            setAbonoForm({ monto: '', metodopago: 'efectivo' });
            setShowAbonoModal(false);
            await fetchAbonos(selectedCuenta.id || selectedCuenta.cuentaid!);
            await fetchCuentas();
            const updatedCuenta = { ...selectedCuenta, montopagado: Number(selectedCuenta.montopagado) + monto, montorestante: nuevoRestante, estado: nuevoEstado };
            setSelectedCuenta(updatedCuenta);
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el abono.', 'error');
        } finally {
            setSavingAbono(false);
        }
    };

    const handleLiquidarcCuentaCompleta = async (cuenta: CuentaPorCobrar) => {
        const montoRestante = Number(cuenta.montorestante);
        if (montoRestante <= 0) return;

        // Prompt user to select payment method
        const { value: metodopago } = await Swal.fire({
            title: 'Seleccionar Método de Pago',
            text: `Se liquidará el saldo restante de C$ ${montoRestante.toFixed(2)}.`,
            input: 'select',
            inputOptions: {
                efectivo: 'Efectivo',
                bac: 'BAC',
                lafise: 'Lafise',
                banpro: 'Banpro',
                transferencia: 'Transferencia'
            },
            inputPlaceholder: 'Seleccione un método',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            confirmButtonText: 'Liquidar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe seleccionar un método de pago';
                }
            }
        });

        if (!metodopago) return;

        setSavingAbono(true);
        try {
            const cuentaid = cuenta.id || cuenta.cuentaid;
            await api.post('/abonos', { cuentaid, monto: montoRestante, metodopago });
            await api.put(`/cuentas-por-cobrar/${cuentaid}`, { montopagado: Number(cuenta.montototal), estado: 'PAGADO' });
            Swal.fire({ icon: 'success', title: 'Cuenta liquidada', timer: 1500, showConfirmButton: false });
            await fetchAbonos(cuentaid!);
            await fetchCuentas();
            setSelectedCuenta({ ...cuenta, montopagado: Number(cuenta.montototal), montorestante: 0, estado: 'PAGADO' });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo liquidar la cuenta.', 'error');
        } finally {
            setSavingAbono(false);
        }
    };

    const openGlobalAbonoModal = (clienteId: number, nombre: string, totalRestante: number) => {
        setGlobalAbonoClientInfo({ id: clienteId, nombre, totalRestante });
        setGlobalAbonoForm({ monto: '', metodopago: 'efectivo' });
        setShowGlobalAbonoModal(true);
    };

    const handleRegistrarAbonoGlobal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!globalAbonoClientInfo) return;
        const totalAbonar = Number(globalAbonoForm.monto);
        if (!totalAbonar || totalAbonar <= 0) { Swal.fire('Error', 'Ingrese un monto válido.', 'error'); return; }
        if (totalAbonar > globalAbonoClientInfo.totalRestante) {
            Swal.fire('Error', `El monto no puede superar el saldo total restante (C$ ${globalAbonoClientInfo.totalRestante.toFixed(2)}).`, 'error');
            return;
        }

        setSavingGlobalAbono(true);
        try {
            const clientCuentas = cuentas
                .filter(c => c.clienteid === globalAbonoClientInfo.id && c.estado !== 'PAGADO')
                .sort((a, b) => new Date(a.fechavencimiento).getTime() - new Date(b.fechavencimiento).getTime());

            let remainingAbono = totalAbonar;

            for (const cuenta of clientCuentas) {
                if (remainingAbono <= 0) break;
                const restante = Number(cuenta.montorestante);
                const abonoMonto = Math.min(restante, remainingAbono);

                await api.post('/abonos', {
                    cuentaid: cuenta.id || cuenta.cuentaid,
                    monto: abonoMonto,
                    metodopago: globalAbonoForm.metodopago,
                });

                const nuevoRestante = restante - abonoMonto;
                const nuevoEstado = nuevoRestante <= 0 ? 'PAGADO' : 'PENDIENTE';
                await api.put(`/cuentas-por-cobrar/${cuenta.id || cuenta.cuentaid}`, {
                    montopagado: Number(cuenta.montopagado) + abonoMonto,
                    estado: nuevoEstado,
                });

                remainingAbono -= abonoMonto;
            }

            Swal.fire({ icon: 'success', title: 'Abono general registrado', timer: 1500, showConfirmButton: false });
            setShowGlobalAbonoModal(false);
            setGlobalAbonoClientInfo(null);
            await fetchCuentas();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el abono general.', 'error');
        } finally {
            setSavingGlobalAbono(false);
        }
    };

    const estadoColor = (estado: string) => {
        if (estado === 'PAGADO') return { color: 'var(--accent-success)', bg: 'rgba(16,185,129,0.1)' };
        if (estado === 'VENCIDO') return { color: 'var(--accent-danger)', bg: 'rgba(239,68,68,0.1)' };
        return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    };

    /* ── Exportar PDF individual de una cuenta ── */
    const exportCuentaIndividualPDF = async (cuenta: CuentaPorCobrar) => {
        const cid = cuenta.id || cuenta.cuentaid!;
        const vid = cuenta.ventaid;
        const cliente = getClienteForCuenta(cuenta) || cuenta.clientes;
        const nombreCliente = (cliente as any)?.nombre || `Cliente #${cuenta.clienteid}`;
        const telefonoCliente = (cliente as any)?.telefono || '—';

        let abonosList: Abono[] = [];
        let productosList: any[] = [];
        try {
            const res = await api.get(`/abonos/cuenta/${cid}`);
            abonosList = getArrayData(res.data, 'abonos');
        } catch { /* empty */ }
        try {
            const res = await api.get(`/venta-productos/venta/${vid}`);
            productosList = getArrayData(res.data);
        } catch { /* empty */ }

        const badgeClass = (estado: string) => {
            if (estado === 'PAGADO') return 'badge-success';
            if (estado === 'VENCIDO') return 'badge-danger';
            return 'badge-warning';
        };

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Cuenta #${cid} - ${nombreCliente}</title>
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
                .badge-danger {
                    background-color: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }
                .badge-warning {
                    background-color: #fffbeb;
                    color: #b45309;
                    border: 1px solid #fde68a;
                }
                .stats-grid {
                    display: flex;
                    gap: 14px;
                    margin-bottom: 24px;
                }
                .stats-card {
                    flex: 1;
                    border: 1px solid #f1f5f9;
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 14px 16px;
                }
                .stats-label {
                    font-size: 10px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .stats-value {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .section-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #4f46e5;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 24px 0 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 16px;
                }
                th {
                    font-size: 10.5px;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 8px;
                    border-bottom: 2px solid #e2e8f0;
                    text-align: left;
                    font-weight: 600;
                }
                td {
                    padding: 8px;
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
                .method-badge {
                    background: #f0f9ff;
                    color: #0284c7;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 10.5px;
                    font-weight: 600;
                    text-transform: uppercase;
                    border: 1px solid #bae6fd;
                }
                .no-data {
                    color: #64748b;
                    font-style: italic;
                    font-size: 13px;
                    padding: 12px 8px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border: 1px dashed #e2e8f0;
                    text-align: center;
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
                    <div class="title">Estado de Cuenta Individual (CxC)</div>
                </div>
                <div class="meta">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Referencia Cuenta</div>
                    <div class="meta-date">Cuenta #${cid} — Venta #${vid}</div>
                </div>
            </div>

            <div class="details-card">
                <div>
                    <div class="details-title">Datos del Cliente</div>
                    <div class="client-name">${nombreCliente}</div>
                    <div class="client-detail">📞 ${telefonoCliente}</div>
                </div>
                <div style="text-align: right;">
                    <span class="badge ${badgeClass(cuenta.estado)}">${cuenta.estado}</span>
                    <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Vence: <strong>${new Date(cuenta.fechavencimiento).toLocaleDateString('es-NI')}</strong></div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-label">Monto Crédito</div>
                    <div class="stats-value tabular-nums">C$ ${Number(cuenta.montototal).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Total Abonado</div>
                    <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${Number(cuenta.montopagado).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Saldo Pendiente</div>
                    <div class="stats-value tabular-nums" style="color: ${Number(cuenta.montorestante) > 0 ? '#dc2626' : '#16a34a'};">C$ ${Number(cuenta.montorestante).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Fecha de Reporte</div>
                    <div class="stats-value" style="font-size: 13.5px;">${new Date().toLocaleDateString('es-NI')}</div>
                </div>
            </div>

            <div class="section-title">Productos de la Venta</div>
            ${productosList.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>Producto</th>
                        <th class="text-center" style="width: 80px;">Cant.</th>
                        <th class="text-right" style="width: 120px;">Precio</th>
                        <th class="text-right" style="width: 100px;">Desc.</th>
                        <th class="text-right" style="width: 130px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${productosList.map((d: any, i: number) => {
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
            </table>` : '<div class="no-data">No se encontraron detalles de productos.</div>'}

            <div class="section-title">Historial de Abonos</div>
            ${abonosList.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>Fecha</th>
                        <th>Método de Pago</th>
                        <th class="text-right">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${abonosList.map((a, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${new Date(a.fecha).toLocaleDateString('es-NI')}</td>
                            <td><span class="method-badge">${a.metodopago}</span></td>
                            <td class="tabular-nums text-right" style="font-weight: 600; color: #16a34a;">C$ ${Number(a.monto).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>` : '<div class="no-data">Sin abonos registrados hasta la fecha.</div>'}

            <div class="report-footer">
                <span>Ambienta POS · Gestión de Cuentas por Cobrar</span>
                <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
            </div>
        </body>
        </html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 500);
        }
    };

    /* ——— Exportar PDF de Cuentas por Cobrar agrupadas por Cliente (SOLO PENDIENTES) ——— */
    const exportClienteCuentasPDF = async (_clienteId: number, clienteNombre: string, clienteTelefono: string, cuentasCliente: CuentaPorCobrar[]) => {
        // Solo incluir cuentas pendientes en el reporte del cliente
        const cuentasPendientes = cuentasCliente.filter(c => c.estado !== 'PAGADO');
        if (cuentasPendientes.length === 0) {
            Swal.fire({ icon: 'info', title: 'Sin cuentas pendientes', text: 'Este cliente no tiene cuentas pendientes por cobrar.', timer: 2500, showConfirmButton: false });
            return;
        }

        // Fetch abonos and product details for pending accounts only
        const abonosPorCuenta: Record<number, Abono[]> = {};
        const productosPorVenta: Record<number, any[]> = {};
        for (const cuenta of cuentasPendientes) {
            const cid = cuenta.id || cuenta.cuentaid!;
            const vid = cuenta.ventaid;
            try {
                const res = await api.get(`/abonos/cuenta/${cid}`);
                abonosPorCuenta[cid] = getArrayData(res.data, 'abonos');
            } catch { abonosPorCuenta[cid] = []; }
            try {
                const res = await api.get(`/venta-productos/venta/${vid}`);
                productosPorVenta[vid] = getArrayData(res.data);
            } catch { productosPorVenta[vid] = []; }
        }

        const totalDeuda = cuentasPendientes.reduce((s, c) => s + Number(c.montototal), 0);
        const totalPagado = cuentasPendientes.reduce((s, c) => s + Number(c.montopagado), 0);
        const totalRestante = cuentasPendientes.reduce((s, c) => s + Number(c.montorestante), 0);
        const pendientes = cuentasPendientes.length;

        const badgeClass = (estado: string) => {
            if (estado === 'PAGADO') return 'badge-success';
            if (estado === 'VENCIDO') return 'badge-danger';
            return 'badge-warning';
        };

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte CxC Pendientes - ${clienteNombre}</title>
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
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 10.5px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .badge-success {
                    background-color: #f0fdf4;
                    color: #15803d;
                    border: 1px solid #bbf7d0;
                }
                .badge-danger {
                    background-color: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }
                .badge-warning {
                    background-color: #fffbeb;
                    color: #b45309;
                    border: 1px solid #fde68a;
                }
                .stats-grid {
                    display: flex;
                    gap: 14px;
                    margin-bottom: 24px;
                }
                .stats-card {
                    flex: 1;
                    border: 1px solid #f1f5f9;
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 14px 16px;
                }
                .stats-label {
                    font-size: 10px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .stats-value {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .cuenta-section {
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    margin-bottom: 24px;
                    overflow: hidden;
                    break-inside: avoid;
                }
                .cuenta-header {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 12px 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .cuenta-header h3 {
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                }
                .cuenta-body {
                    padding: 18px;
                }
                .info-row {
                    display: flex;
                    gap: 24px;
                    margin-bottom: 16px;
                    font-size: 13px;
                }
                .info-row div span {
                    color: #64748b;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: block;
                    margin-bottom: 2px;
                }
                .info-row div strong {
                    color: #0f172a;
                    font-weight: 600;
                }
                .sub-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #4f46e5;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 14px 0 6px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 14px;
                }
                th {
                    font-size: 10px;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 6px 8px;
                    border-bottom: 2px solid #e2e8f0;
                    text-align: left;
                    font-weight: 600;
                }
                td {
                    padding: 6px 8px;
                    font-size: 12.5px;
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
                .method-badge {
                    background: #f0f9ff;
                    color: #0284c7;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    border: 1px solid #bae6fd;
                }
                .no-data {
                    color: #64748b;
                    font-style: italic;
                    font-size: 12px;
                    padding: 8px;
                    background: #f8fafc;
                    border-radius: 6px;
                    border: 1px dashed #e2e8f0;
                    text-align: center;
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
                    <div class="title">Reporte de Cuentas Pendientes (CxC)</div>
                </div>
                <div class="meta">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Fecha del Reporte</div>
                    <div class="meta-date">${new Date().toLocaleDateString('es-NI')}</div>
                </div>
            </div>

            <div class="details-card">
                <div>
                    <div class="details-title">Datos del Cliente</div>
                    <div class="client-name">${clienteNombre}</div>
                    <div class="client-detail">📞 ${clienteTelefono || '—'}</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-label">Cuentas Pendientes</div>
                    <div class="stats-value">${pendientes}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Total Créditos</div>
                    <div class="stats-value tabular-nums">C$ ${totalDeuda.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Total Abonado</div>
                    <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${totalPagado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-label">Total Restante</div>
                    <div class="stats-value tabular-nums" style="color: ${totalRestante > 0 ? '#dc2626' : '#16a34a'};">C$ ${totalRestante.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            ${cuentasPendientes.map((cuenta) => {
            const cid = cuenta.id || cuenta.cuentaid!;
            const abonosList = abonosPorCuenta[cid] || [];
            const productosList = productosPorVenta[cuenta.ventaid] || [];
            return `
                    <div class="cuenta-section">
                        <div class="cuenta-header">
                            <h3>Cuenta #${cid} — Venta #${cuenta.ventaid}</h3>
                            <span class="badge ${badgeClass(cuenta.estado)}">${cuenta.estado}</span>
                        </div>
                        <div class="cuenta-body">
                            <div class="info-row">
                                <div><span>Monto Crédito</span><strong>C$ ${Number(cuenta.montototal).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong></div>
                                <div><span>Total Abonado</span><strong style="color: #16a34a;">C$ ${Number(cuenta.montopagado).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong></div>
                                <div><span>Saldo Pendiente</span><strong style="color: ${Number(cuenta.montorestante) > 0 ? '#dc2626' : '#16a34a'};">C$ ${Number(cuenta.montorestante).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong></div>
                                <div><span>Fecha Vencimiento</span><strong>${new Date(cuenta.fechavencimiento).toLocaleDateString('es-NI')}</strong></div>
                            </div>

                            <div class="sub-title">Detalle de Productos Comprados</div>
                            ${productosList.length > 0 ? `
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th class="text-center" style="width: 70px;">Cant.</th>
                                        <th class="text-right" style="width: 100px;">Precio</th>
                                        <th class="text-right" style="width: 80px;">Desc.</th>
                                        <th class="text-right" style="width: 110px;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productosList.map((d: any) => {
                const nombre = d.productonombre || d.productos?.nombre || d.nombre || `Producto #${d.productoid}`;
                const cant = Number(d.cantidad);
                const precio = Number(d.preciounitario);
                const desc = Number(d.descuento || 0);
                const sub = cant * precio - desc;
                return `
                                            <tr>
                                                <td style="font-weight: 500; color: #0f172a;">${nombre}</td>
                                                <td class="tabular-nums text-center">${cant}</td>
                                                <td class="tabular-nums text-right">C$ ${precio.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                                <td class="tabular-nums text-right">C$ ${desc.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                                <td class="tabular-nums text-right" style="font-weight: 600; color: #0f172a;">C$ ${sub.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        `;
            }).join('')}
                                </tbody>
                            </table>` : '<div class="no-data">No se encontraron detalles de productos.</div>'}

                            <div class="sub-title">Abonos Registrados</div>
                            ${abonosList.length > 0 ? `
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 40px;">#</th>
                                        <th>Fecha de Abono</th>
                                        <th>Método de Pago</th>
                                        <th class="text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${abonosList.map((a, i) => `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td>${new Date(a.fecha).toLocaleDateString('es-NI')}</td>
                                            <td><span class="method-badge">${a.metodopago}</span></td>
                                            <td class="tabular-nums text-right" style="font-weight: 600; color: #16a34a;">C$ ${Number(a.monto).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>` : '<div class="no-data">Sin abonos registrados en esta cuenta.</div>'}
                        </div>
                    </div>
                `;
        }).join('')}

            <div class="totals-section" style="width: 360px;">
                <div class="totals-row">
                    <span>Total Créditos Otorgados</span>
                    <span class="tabular-nums">C$ ${totalDeuda.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="totals-row">
                    <span>Total General Abonado</span>
                    <span class="tabular-nums" style="color: #16a34a;">C$ ${totalPagado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="totals-row grand-total">
                    <span>Saldo Pendiente Consolidado</span>
                    <span class="tabular-nums" style="color: ${totalRestante > 0 ? '#dc2626' : '#16a34a'};">C$ ${totalRestante.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div class="report-footer">
                <span>Ambienta POS · Sistema de Cobros y Ventas</span>
                <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
            </div>
        </body>
        </html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 500);
        }
    };

    // WS link for cuenta
    const buildWsLink = (cuenta: CuentaPorCobrar) => {
        const cliente = getClienteForCuenta(cuenta);
        const tel = (cuenta.clientes?.telefono || cliente?.telefono || '').replace(/\D/g, '');
        if (!tel) return null;
        const telFull = tel.startsWith('505') ? tel : `505${tel}`;
        const nombre = cuenta.clientes?.nombre || cliente?.nombre || `Cliente #${cuenta.clienteid}`;
        return `https://wa.me/${telFull}?text=${encodeURIComponent(`Hola ${nombre}, le recordamos que tiene un saldo pendiente de C$${Number(cuenta.montorestante).toFixed(2)}. Por favor comuníquese con nosotros para coordinar su pago. ¡Gracias!`)}`;
    };

    // WS link for entire client consolidated debt
    const buildClienteWsLink = (nombre: string, telefono: string, totalRestante: number) => {
        const tel = (telefono || '').replace(/\D/g, '');
        if (!tel) return null;
        const telFull = tel.startsWith('505') ? tel : `505${tel}`;
        return `https://wa.me/${telFull}?text=${encodeURIComponent(`Hola ${nombre}, le recordamos que su saldo total adeudado en Ambienta POS es de C$ ${totalRestante.toFixed(2)}. Por favor comuníquese con nosotros para coordinar su pago. ¡Gracias!`)}`;
    };

    const filteredCuentas = cuentas.filter((c: CuentaPorCobrar) => {
        const cliente = getClienteForCuenta(c);
        const nombreCliente = c.clientes?.nombre || cliente?.nombre || `Cliente #${c.clienteid}`;
        return String(c.id || c.cuentaid).includes(cuentaSearchQuery) ||
            String(c.ventaid).includes(cuentaSearchQuery) ||
            nombreCliente.toLowerCase().includes(cuentaSearchQuery.toLowerCase());
    });

    return {
        cuentas, cuentaSearchQuery, setCuentaSearchQuery, filteredCuentas,
        selectedCuenta, setSelectedCuenta, abonos, loadingAbonos,
        showAbonoModal, setShowAbonoModal, abonoForm, setAbonoForm, savingAbono,
        cuentaSortBy, cuentaSortOrder, expandedClientId, setExpandedClientId,
        showGlobalAbonoModal, setShowGlobalAbonoModal, globalAbonoForm, setGlobalAbonoForm,
        globalAbonoClientInfo, setGlobalAbonoClientInfo, savingGlobalAbono,
        cuentasSortField, setCuentasSortField, cuentasSortDirection, setCuentasSortDirection,
        cuentasPages, setCuentasPages,
        openCuentaDetail, getClienteForCuenta,
        handleRegistrarAbono, handleLiquidarcCuentaCompleta,
        openGlobalAbonoModal, handleRegistrarAbonoGlobal,
        estadoColor, exportCuentaIndividualPDF, exportClienteCuentasPDF,
        buildWsLink, buildClienteWsLink,
    };
}
