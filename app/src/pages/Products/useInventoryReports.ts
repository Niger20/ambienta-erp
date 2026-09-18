import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { Product } from './types';

export function useInventoryReports(
    products: Product[],
    nombreUsuario: string | undefined,
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
) {
    const exportInventarioPDF = () => {
        const activeProds = products;
        const totalProducts = activeProds.length;
        const totalStock = activeProds.reduce((sum, p) => sum + (p.stockactual || 0), 0);
        const totalCost = activeProds.reduce((sum, p) => sum + (Number(p.preciocompra || 0) * (p.stockactual || 0)), 0);
        const totalSales = activeProds.reduce((sum, p) => sum + (Number(p.precioventa || 0) * (p.stockactual || 0)), 0);

        const printContent = `
            <html>
            <head>
                <title>Reporte de Inventario Completo - Ambienta POS</title>
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
                        border-bottom: 2px solid #4f46e5;
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
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 24px;
                    }
                    th {
                        font-size: 10px;
                        color: #475569;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        padding: 10px 8px;
                        border-bottom: 2px solid #e2e8f0;
                        background-color: #f8fafc;
                        text-align: left;
                        font-weight: 600;
                    }
                    td {
                        padding: 8px 8px;
                        font-size: 12px;
                        border-bottom: 1px solid #f1f5f9;
                        color: #334155;
                    }
                    tr:nth-child(even) {
                        background-color: #fafbfc;
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
                        <div class="title">Reporte Detallado de Inventario</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Generado por</div>
                        <div class="meta-date">${nombreUsuario || 'Sistema'}</div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-label">Total Productos</div>
                        <div class="stats-value">${totalProducts}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Stock Total</div>
                        <div class="stats-value tabular-nums">${totalStock}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Valorización Costo</div>
                        <div class="stats-value tabular-nums" style="color: #4f46e5;">C$ ${totalCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Valorización Venta</div>
                        <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${totalSales.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Código Barra</th>
                            <th>Nombre del Producto</th>
                            <th>Categoría</th>
                            <th class="text-right">P. Compra</th>
                            <th class="text-right">P. Venta</th>
                            <th class="text-center">Stock</th>
                            <th class="text-right">Val. Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activeProds.map(p => {
            const stock = p.stockactual || 0;
            const pCompra = Number(p.preciocompra || 0);
            const pVenta = Number(p.precioventa || 0);
            const valCosto = pCompra * stock;
            return `
                                <tr>
                                    <td class="tabular-nums">${p.codigobarra || '—'}</td>
                                    <td style="font-weight: 500; color: #0f172a;">${p.nombre}</td>
                                    <td>${p.categorianombre || 'Sin Categoría'}</td>
                                    <td class="tabular-nums text-right">C$ ${pCompra.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td class="tabular-nums text-right">C$ ${pVenta.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td class="tabular-nums text-center" style="font-weight: 600;">${stock}</td>
                                    <td class="tabular-nums text-right" style="font-weight: 600;">C$ ${valCosto.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>

                <div class="report-footer">
                    <span>Ambienta POS · Control de Stock y Valoración</span>
                    <span>Fecha: ${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>
        `;
        const win = window.open('', '_blank');
        if (win) { win.document.write(printContent); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
    };

    const handleRecalculateStockMinimo = async () => {
        const result = await Swal.fire({
            title: '¿Recalcular stock mínimo?',
            text: "Esta acción recalculará automáticamente el stock mínimo de todos los productos basándose en el historial de ventas de los últimos 21 días.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, recalcular',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        await requestAuth('RECALCULAR_STOCK_MINIMO', 'Recalcular stock mínimo automático global', async () => {
            Swal.fire({
                title: 'Recalculando...',
                text: 'Espere por favor mientras se procesa la solicitud.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await api.post('/productos/recalculate-stock-minimo');
                Swal.fire({
                    icon: 'success',
                    title: '¡Recalculado!',
                    text: 'El stock mínimo se ha recalculado exitosamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchData();
            } catch (err: any) {
                console.error("Failed to recalculate stock minimo", err);
                const errMsg = err.response?.data?.error || 'No se pudo recalcular el stock mínimo.';
                Swal.fire('Error', typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), 'error');
            }
        });
    };

    return { exportInventarioPDF, handleRecalculateStockMinimo };
}
