import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Movimiento, Product } from './types';

const MOV_ITEMS_PER_PAGE = 15;

export function useMovimientos(
    products: Product[],
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
) {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [movLoading, setMovLoading] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const [movSearch, setMovSearch] = useState('');
    const [movPage, setMovPage] = useState(1);
    const [movimientosPages, setMovimientosPages] = useState<Record<number, number>>({});

    useEffect(() => {
        setMovPage(1);
    }, [movSearch]);

    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [ajusteForm, setAjusteForm] = useState({ productoid: '', tipo: 'INGRESO', cantidad: '', motivo: '' });
    const [ajusteProductSearch, setAjusteProductSearch] = useState('');
    const [showAjusteProductDropdown, setShowAjusteProductDropdown] = useState(false);

    const fetchMovimientos = async () => {
        setMovLoading(true);
        try {
            const res = await api.get('/movimientos-inventario?limit=0');
            setMovimientos(getArrayData(res.data, 'movimientos'));
        } catch { setMovimientos([]); }
        finally { setMovLoading(false); }
    };

    const openAjusteModal = () => {
        setAjusteForm({ productoid: '', tipo: 'INGRESO', cantidad: '', motivo: '' });
        setAjusteProductSearch('');
        setShowAjusteProductDropdown(false);
        setShowAjusteModal(true);
    };

    const handleCreateAjuste = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ajusteForm.productoid || !ajusteForm.cantidad) return;
        const prod = products.find(p => p.id === Number(ajusteForm.productoid));
        if (!prod) return;
        const doAjuste = async () => {
            try {
                await api.post('/movimientos-inventario', {
                    productoid: Number(ajusteForm.productoid),
                    tipomovimiento: ajusteForm.tipo,
                    cantidad: Math.floor(Number(ajusteForm.cantidad)),
                    motivo: ajusteForm.motivo || 'Ajuste manual',
                    stockanterior: Math.floor(Number(prod.stockactual ?? 0)),
                });
                setShowAjusteModal(false);
                fetchMovimientos();
                fetchData();
                Swal.fire({ icon: 'success', title: 'Ajuste registrado', timer: 1500, showConfirmButton: false });
            } catch (err: any) {
                const errMsg = err.response?.data?.error;
                Swal.fire('Error', typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) || 'No se pudo registrar el ajuste', 'error');
            }
        };
        await requestAuth('AJUSTE_INVENTARIO', `Ajuste manual de inventario — ${prod.nombre}`, doAjuste);
    };

    const exportMovimientosPDF = (nombre: string, movs: Movimiento[]) => {
        const sorted = [...movs].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        const ingresos = sorted.filter(m => m.tipomovimiento === 'INGRESO').reduce((s, m) => s + m.cantidad, 0);
        const egresos = sorted.filter(m => m.tipomovimiento !== 'INGRESO').reduce((s, m) => s + m.cantidad, 0);
        const printContent = `
            <html>
            <head>
                <title>Movimientos - ${nombre}</title>
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
                        margin-bottom: 8px;
                    }
                    .details-text {
                        font-size: 14px;
                        color: #334155;
                        font-weight: 500;
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
                        font-size: 16px;
                        font-weight: 700;
                        color: #0f172a;
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
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 10.5px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .badge-in {
                        background-color: #f0fdf4;
                        color: #16a34a;
                        border: 1px solid #bbf7d0;
                    }
                    .badge-out {
                        background-color: #fef2f2;
                        color: #dc2626;
                        border: 1px solid #fecaca;
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
                        <div class="title">Movimientos de Inventario</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Fecha de Reporte</div>
                        <div class="meta-date">${new Date().toLocaleDateString('es-NI')}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-title">Producto</div>
                    <div class="details-text">${nombre}</div>
                </div>

                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-label">Total Movimientos</div>
                        <div class="stats-value">${sorted.length}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Total Ingresos</div>
                        <div class="stats-value tabular-nums" style="color: #16a34a;">+${ingresos}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Total Egresos</div>
                        <div class="stats-value tabular-nums" style="color: #dc2626;">-${egresos}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Stock Neto</div>
                        <div class="stats-value tabular-nums">${ingresos - egresos}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th style="text-align:right">Cantidad</th>
                            <th style="text-align:right">Stock Ant.</th>
                            <th>Motivo</th>
                            <th>Referencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map(m => {
            const ref = m.ventaid ? `Venta #${m.ventaid}` : m.compraid ? `Compra #${m.compraid}` : '—';
            const isIngreso = m.tipomovimiento === 'INGRESO';
            return `
                                <tr>
                                    <td class="tabular-nums">${new Date(m.fecha).toLocaleString('es-NI')}</td>
                                    <td><span class="badge ${isIngreso ? 'badge-in' : 'badge-out'}">${m.tipomovimiento}</span></td>
                                    <td class="tabular-nums text-right" style="font-weight:600;color:${isIngreso ? '#16a34a' : '#dc2626'}">${isIngreso ? '+' : '-'}${m.cantidad}</td>
                                    <td class="tabular-nums text-right">${m.stockanterior}</td>
                                    <td>${m.motivo || '—'}</td>
                                    <td style="font-weight:500">${ref}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>

                <div class="report-footer">
                    <span>Sistema Ambienta POS</span>
                    <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>
        `;
        const win = window.open('', '_blank');
        if (win) { win.document.write(printContent); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
    };

    // Agrupar movimientos por producto localmente para la vista
    const grouped = movimientos.reduce((acc, mov) => {
        if (!acc[mov.productoid]) {
            const prodLocal = products.find(p => p.id === mov.productoid);
            acc[mov.productoid] = { nombre: mov.productos?.nombre || prodLocal?.nombre || `Producto #${mov.productoid}`, totalMovs: 0, movs: [] as Movimiento[] };
        }
        acc[mov.productoid].movs.push(mov);
        acc[mov.productoid].totalMovs++;
        return acc;
    }, {} as Record<number, { nombre: string, totalMovs: number, movs: Movimiento[] }>);

    const filteredGroups = Object.entries(grouped)
        .filter(([_, data]) =>
            data.nombre.toLowerCase().includes(movSearch.toLowerCase()) ||
            data.movs.some(m => (m.motivo || '').toLowerCase().includes(movSearch.toLowerCase()))
        );

    const totalMovGroupsPages = Math.ceil(filteredGroups.length / MOV_ITEMS_PER_PAGE);
    const paginatedGroups = filteredGroups.slice((movPage - 1) * MOV_ITEMS_PER_PAGE, movPage * MOV_ITEMS_PER_PAGE);

    return {
        movLoading, expandedProductId, setExpandedProductId,
        movSearch, setMovSearch, movPage, setMovPage,
        movimientosPages, setMovimientosPages,
        fetchMovimientos, exportMovimientosPDF,
        filteredGroups, totalMovGroupsPages, paginatedGroups,
        showAjusteModal, setShowAjusteModal, openAjusteModal,
        ajusteForm, setAjusteForm, ajusteProductSearch, setAjusteProductSearch,
        showAjusteProductDropdown, setShowAjusteProductDropdown,
        handleCreateAjuste,
    };
}
