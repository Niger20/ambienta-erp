import Swal from 'sweetalert2';
import api from '../../api/axios';

export function usePropuestas() {
    const generarPDFPropuestaGlobal = (resumen: any, propuesta: any[]) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Habilite las ventanas emergentes en su navegador.', 'error');
            return;
        }

        const html = `
            <html>
            <head>
                <title>Pedido Global de Reabastecimiento - Ambienta POS</title>
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
                    .details-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        padding: 16px 20px;
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .details-title {
                        font-size: 11px;
                        font-weight: 600;
                        color: #4f46e5;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 6px;
                    }
                    .details-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    .details-grid div {
                        font-size: 13px;
                        color: #64748b;
                    }
                    .details-grid div strong {
                        color: #0f172a;
                        font-weight: 600;
                        margin-left: 4px;
                    }
                    .stats-grid {
                        display: flex;
                        gap: 14px;
                        margin-bottom: 24px;
                    }
                    .stats-card {
                        flex: 1;
                        border: 1px solid #e2e8f0;
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
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .badge-critica {
                        background-color: #fef2f2;
                        color: #dc2626;
                        font-weight: 700;
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid #fecaca;
                        font-size: 10px;
                    }
                    .badge-alta {
                        background-color: #fff7ed;
                        color: #ea580c;
                        font-weight: 700;
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid #ffedd5;
                        font-size: 10px;
                    }
                    .badge-media {
                        background-color: #eff6ff;
                        color: #2563eb;
                        font-weight: 700;
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid #dbeafe;
                        font-size: 10px;
                    }
                    .badge-sugerido {
                        background-color: #f0fdf4;
                        color: #16a34a;
                        font-weight: 700;
                        padding: 2px 6px;
                        border-radius: 4px;
                        border: 1px solid #bbf7d0;
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
                        <div class="title">Pedido Global de Reabastecimiento de Inventario</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Fecha del Reporte</div>
                        <div class="meta-date">${new Date().toLocaleDateString('es-NI')}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-grid">
                        <div class="details-title">Alcance del Reporte</div>
                        <div>Tipo: <strong>Consolidado Global de Productos por Reabastecer</strong></div>
                        <div>Criterio: <strong>Productos con Stock Actual &le; Stock Mínimo o Agotados</strong></div>
                    </div>
                    <div class="details-grid" style="text-align: right;">
                        <div class="details-title">Cálculo de Pedido Sugerido</div>
                        <div>Fórmula: <strong>(Demanda Ponderada 3 Semanas + Stock Mínimo) - Stock Actual</strong></div>
                        <div>Ponderación: <strong>50% W1 / 30% W2 / 20% W3</strong></div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-label">Productos por Reabastecer</div>
                        <div class="stats-value" style="color: #4f46e5;">${resumen.totalProductosNecesitados}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Total Unidades Sugeridas</div>
                        <div class="stats-value">${resumen.totalUnidadesSugeridas}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Nivel Crítico (Agotados)</div>
                        <div class="stats-value" style="color: #dc2626;">${resumen.totalCriticos}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Inversión Total Estimada</div>
                        <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${resumen.inversionTotalEstimada.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th class="text-center">Prioridad</th>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th class="text-center">Stock Act.</th>
                            <th class="text-center">Stock Mín.</th>
                            <th class="text-right">Pond. 3S</th>
                            <th class="text-center">Pedido Sugerido</th>
                            <th class="text-right">P. Compra</th>
                            <th class="text-right">Subtotal Est.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${propuesta.map(p => {
            const badgeClass = p.prioridad === 'CRÍTICA' ? 'badge-critica' : p.prioridad === 'ALTA' ? 'badge-alta' : 'badge-media';
            return `
                                <tr>
                                    <td class="text-center"><span class="${badgeClass}">${p.prioridad}</span></td>
                                    <td class="tabular-nums" style="font-size: 11px; color: #64748b;">${p.codigobarra || 'N/A'}</td>
                                    <td style="font-weight: 600;">${p.nombre}</td>
                                    <td style="color: #64748b;">${p.categoria || 'Sin categoría'}</td>
                                    <td class="text-center tabular-nums" style="${p.stockactual <= 0 ? 'color: #dc2626; font-weight: 700;' : ''}">${p.stockactual}</td>
                                    <td class="text-center tabular-nums">${p.stockminimo}</td>
                                    <td class="text-right tabular-nums">${p.promedioPonderado}</td>
                                    <td class="text-center tabular-nums"><span class="badge-sugerido">${p.sugerido}</span></td>
                                    <td class="text-right tabular-nums">C$ ${Number(p.preciocompra).toFixed(2)}</td>
                                    <td class="text-right tabular-nums" style="font-weight: 600;">C$ ${(p.costoTotalEstimado || (p.sugerido * p.preciocompra)).toFixed(2)}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>

                <div class="report-footer">
                    <div>Generado automáticamente por el Sistema Ambienta POS</div>
                    <div>Página 1 de 1</div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    const handleGenerarPropuestaGlobal = async () => {
        Swal.fire({
            title: 'Generando pedido global...',
            html: 'Analizando inventario y ventas de las últimas 3 semanas...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await api.get('/compras/propuesta-global');
            Swal.close();
            const { resumen, propuesta } = res.data;

            if (!propuesta || propuesta.length === 0) {
                Swal.fire('Información', 'No hay productos que requieran reabastecimiento en este momento.', 'info');
                return;
            }

            generarPDFPropuestaGlobal(resumen, propuesta);
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo generar la propuesta de pedido global.', 'error');
        }
    };

    const generarPDFPropuesta = (proveedor: any, resumen: any, propuesta: any[]) => {
        const totalItemsEvaluated = propuesta.length;
        const itemsToOrder = propuesta.filter(p => p.sugerido > 0).length;
        const totalEstimatedCost = resumen.inversionTotalEstimada ?? propuesta.reduce((sum, p) => sum + (p.sugerido * p.preciocompra), 0);

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Habilite las ventanas emergentes.', 'error');
            return;
        }

        const html = `
            <html>
            <head>
                <title>Propuesta de Pedido - ${proveedor.nombreempresa}</title>
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
                    .details-card {
                        border: 1px solid #f1f5f9;
                        background: #f8fafc;
                        border-radius: 10px;
                        padding: 16px 20px;
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .details-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        font-size: 12px;
                        color: #475569;
                    }
                    .details-grid strong {
                        color: #0f172a;
                        margin-left: 6px;
                    }
                    .details-title {
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #64748b;
                        font-weight: 600;
                        margin-bottom: 4px;
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
                    .badge-sugerido {
                        background: #ecfdf5;
                        color: #059669;
                        padding: 3px 8px;
                        border-radius: 9999px;
                        font-weight: 700;
                        font-size: 12px;
                        border: 1px solid #a7f3d0;
                    }
                    .badge-cero {
                        color: #94a3b8;
                        font-size: 12px;
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
                        <div class="title">Propuesta de Pedido de Compra</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Fecha del Reporte</div>
                        <div class="meta-date">${new Date().toLocaleDateString('es-NI')}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-grid">
                        <div class="details-title">Datos del Proveedor</div>
                        <div>Empresa:<strong>${proveedor.nombreempresa}</strong></div>
                        <div>Asesor:<strong>${proveedor.asesorventas || '—'}</strong></div>
                        <div>Teléfono:<strong>${proveedor.telefono || '—'}</strong></div>
                    </div>
                    <div class="details-grid" style="text-align: right;">
                        <div class="details-title">Método de Cálculo</div>
                        <div>Ventas ponderadas: <strong>3 semanas (50% / 30% / 20%)</strong></div>
                        <div>Seguridad: <strong>Mínimo Stock incluido</strong></div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-label">Productos Evaluados</div>
                        <div class="stats-value">${totalItemsEvaluated}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Productos a Pedir</div>
                        <div class="stats-value" style="color: #4f46e5;">${itemsToOrder}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Inversión Estimada</div>
                        <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${totalEstimatedCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th class="text-right">P. Compra</th>
                            <th class="text-center">Stock Act.</th>
                            <th class="text-center">Stock Mín.</th>
                            <th class="text-center">Ventas S1 (50%)</th>
                            <th class="text-center">Ventas S2 (30%)</th>
                            <th class="text-center">Ventas S3 (20%)</th>
                            <th class="text-right">Demanda Pond.</th>
                            <th class="text-right">Pedido Sugerido</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${propuesta.map(p => {
            const isSugerido = p.sugerido > 0;
            return `
                                <tr>
                                    <td style="font-weight: 500; color: #0f172a;">${p.nombre}</td>
                                    <td class="tabular-nums text-right">C$ ${Number(p.preciocompra).toFixed(2)}</td>
                                    <td class="tabular-nums text-center" style="font-weight: 600; color: ${p.stockactual <= p.stockminimo ? '#dc2626' : '#1e293b'}">${p.stockactual}</td>
                                    <td class="tabular-nums text-center" style="color: #64748b">${p.stockminimo}</td>
                                    <td class="tabular-nums text-center">${p.ventasSemana1}</td>
                                    <td class="tabular-nums text-center">${p.ventasSemana2}</td>
                                    <td class="tabular-nums text-center">${p.ventasSemana3}</td>
                                    <td class="tabular-nums text-right" style="color: #4f46e5">${Number(p.promedioPonderado).toFixed(2)}</td>
                                    <td class="tabular-nums text-right">
                                        <span class="${isSugerido ? 'badge-sugerido' : 'badge-cero'}">
                                            ${isSugerido ? p.sugerido : '0'}
                                        </span>
                                    </td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>

                <div class="report-footer">
                    <span>Ambienta POS · Sistema de Compras</span>
                    <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
                </div>
            </body>
            </html>`;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
    };

    const handleGenerarPropuesta = async (proveedorId: number) => {
        Swal.fire({
            title: 'Generando propuesta...',
            html: 'Calculando ventas ponderadas de 3 semanas (50% S1, 30% S2, 20% S3) y stock mínimo...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await api.get(`/compras/propuesta/${proveedorId}`);
            Swal.close();
            const { proveedor, resumen, propuesta } = res.data;

            if (!propuesta || propuesta.length === 0) {
                Swal.fire('Información', 'No hay productos asociados a este proveedor para analizar.', 'info');
                return;
            }

            generarPDFPropuesta(proveedor, resumen, propuesta);
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo generar la propuesta.', 'error');
        }
    };

    return { handleGenerarPropuestaGlobal, handleGenerarPropuesta };
}
