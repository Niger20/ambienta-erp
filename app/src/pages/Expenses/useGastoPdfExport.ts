import type { Gasto, PagoGasto } from './types';

export function useGastoPdfExport() {
    const exportPDF = (selectedGasto: Gasto | null, pagos: PagoGasto[], totalPagadoGasto: () => number) => {
        if (!selectedGasto) return;
        const printContent = `
            <html>
            <head>
                <title>Historial de Pagos - ${selectedGasto.nombre}</title>
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
                        font-size: 13.5px;
                        border-bottom: 1px solid #f1f5f9;
                        color: #334155;
                    }
                    .tabular-nums {
                        font-family: 'JetBrains Mono', monospace;
                        font-variant-numeric: tabular-nums;
                    }
                    .method-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 10.5px;
                        font-weight: 600;
                        text-transform: uppercase;
                        background-color: #f0f9ff;
                        color: #0284c7;
                        border: 1px solid #bae6fd;
                    }
                    .totals-section {
                        width: 280px;
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
                        <div class="title">Historial de Pagos de Gasto</div>
                    </div>
                    <div class="meta">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Fecha de Reporte</div>
                        <div class="meta-date">${new Date().toLocaleDateString('es-NI')}</div>
                    </div>
                </div>

                <div class="details-card">
                    <div class="details-title">Gasto Operativo</div>
                    <div class="details-text">${selectedGasto.nombre}${selectedGasto.descripcion ? ` — ${selectedGasto.descripcion}` : ''}</div>
                </div>

                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-label">Total Pagado</div>
                        <div class="stats-value tabular-nums" style="color: #16a34a;">C$ ${totalPagadoGasto().toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-label">Nº de Pagos</div>
                        <div class="stats-value">${pagos.length}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 60px;">#</th>
                            <th>Fecha</th>
                            <th>Método de Pago</th>
                            <th style="text-align:right">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pagos.map((pg, i) => {
                            const p = pg.pago ?? pg.pagos ?? {};
                            const metodo = p.metodopago || '—';
                            return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${p.fecha ? new Date(p.fecha).toLocaleDateString('es-NI') : '—'}</td>
                                    <td><span class="method-badge">${metodo}</span></td>
                                    <td class="tabular-nums text-right" style="font-weight:600;color:#16a34a">C$ ${Number(p.monto || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>

                <div class="totals-section">
                    <div class="totals-row grand-total">
                        <span>Total Pagado</span>
                        <span class="tabular-nums">C$ ${totalPagadoGasto().toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div class="report-footer">
                    <span>Sistema Ambienta POS</span>
                    <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
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

    return { exportPDF };
}
