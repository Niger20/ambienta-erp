import api from '../api/axios';
import { getArrayData } from './arrayUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CellHookData, UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* ── PDF: paleta de colores compartida (matching Ambienta POS design system) ── */
const PDF_COLORS = {
    NAVY: [15, 23, 42],        // #0f172a
    SL800: [30, 41, 59],       // #1e293b
    SL600: [71, 85, 105],      // #475569
    SL500: [100, 116, 139],    // #64748b
    SL400: [148, 163, 184],    // #94a3b8
    SL300: [203, 213, 225],    // #cbd5e1
    SL200: [226, 232, 240],    // #e2e8f0
    SL50: [248, 250, 252],     // #f8fafc
    WHITE: [255, 255, 255],
    GREEN: [16, 185, 129],     // #10b981
    GREEN_DARK: [4, 120, 87],  // #047857
    GREEN_BG: [236, 253, 245], // #ecfdf5
    GREEN_BD: [167, 243, 208], // #a7f3d0
    RED: [239, 68, 68],        // #ef4444
    RED_DARK: [185, 28, 28],   // #b91c1c
    RED_BG: [254, 242, 242],   // #fef2f2
    RED_BD: [254, 202, 202],   // #fecaca
    BLUE: [59, 130, 246],      // #3b82f6
    BLUE_BG: [239, 246, 255],  // #eff6ff
    BLUE_BD: [191, 219, 254],  // #bfdbfe
} as const;

const fmtMoney = (n: number | string | undefined | null): string => {
    const num = Number(n || 0);
    if (isNaN(num)) return 'C$ 0.00';
    const isNeg = num < 0;
    const abs = Math.abs(num).toFixed(2);
    const [intPart, decPart] = abs.split('.');
    const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${isNeg ? '-' : ''}C$ ${withSep}.${decPart}`;
};

/** Círculo numerado (navy, numeral blanco) que antecede cada título de sección del PDF de cierre. */
const drawSectionBadge = (doc: jsPDF, x: number, titleBaselineY: number, radius: number, num: number) => {
    const cy = titleBaselineY - radius * 0.75;
    doc.setFillColor(...PDF_COLORS.NAVY);
    doc.circle(x + radius, cy, radius, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...PDF_COLORS.WHITE);
    doc.text(String(num), x + radius, cy + radius * 0.55, { align: 'center' });
};

/* ── PDF: íconos decorativos simples (trazo vectorial) para las tarjetas de resumen del cierre ── */
const drawCoinIcon = (doc: jsPDF, cx: number, cy: number, color: readonly number[]) => {
    doc.setDrawColor(...color as [number, number, number]);
    doc.setLineWidth(0.35);
    doc.circle(cx - 0.9, cy, 2.2, 'S');
    doc.circle(cx + 0.9, cy, 2.2, 'S');
};
const drawBagIcon = (doc: jsPDF, cx: number, cy: number, color: readonly number[]) => {
    doc.setDrawColor(...color as [number, number, number]);
    doc.setLineWidth(0.35);
    doc.roundedRect(cx - 2.6, cy - 1.6, 5.2, 4.2, 0.6, 0.6, 'S');
    doc.line(cx - 1.3, cy - 1.6, cx - 1.3, cy - 2.9);
    doc.line(cx + 1.3, cy - 1.6, cx + 1.3, cy - 2.9);
    doc.line(cx - 1.3, cy - 2.9, cx + 1.3, cy - 2.9);
};
const drawArrowIcon = (doc: jsPDF, cx: number, cy: number, color: readonly number[]) => {
    doc.setDrawColor(...color as [number, number, number]);
    doc.setLineWidth(0.45);
    doc.line(cx - 2.2, cy + 2.2, cx + 2.2, cy - 2.2);
    doc.line(cx + 2.2, cy - 2.2, cx + 0.3, cy - 2.2);
    doc.line(cx + 2.2, cy - 2.2, cx + 2.2, cy - 0.3);
};
const drawShieldIcon = (doc: jsPDF, cx: number, cy: number, color: readonly number[]) => {
    doc.setDrawColor(...color as [number, number, number]);
    doc.setLineWidth(0.35);
    doc.lines(
        [[2.4, 0], [0, 2.6], [-1.2, 3.4], [-1.2, -3.4], [0, -2.6]],
        cx - 2.4, cy - 3,
        [1, 1], 'S', true,
    );
};

const CARD_ICONS = {
    coin: drawCoinIcon,
    bag: drawBagIcon,
    arrow: drawArrowIcon,
    shield: drawShieldIcon,
} as const;

/** Estilos base compartidos por las dos tablas del PDF de cierre (desglose y movimientos). */
const baseTableStyles = (fontSize: number): Pick<UserOptions, 'theme' | 'styles' | 'headStyles' | 'alternateRowStyles'> => ({
    theme: 'striped',
    styles: {
        fontSize,
        cellPadding: { top: fontSize > 8 ? 2.6 : 2.2, bottom: fontSize > 8 ? 2.6 : 2.2, left: 4, right: 4 },
        textColor: PDF_COLORS.SL800 as any,
        lineWidth: 0,
        font: 'helvetica',
    },
    headStyles: {
        fillColor: PDF_COLORS.SL50 as any,
        textColor: PDF_COLORS.SL600 as any,
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: { bottom: 0.4 },
        lineColor: PDF_COLORS.SL200 as any,
    },
    alternateRowStyles: { fillColor: [250, 251, 253] as any },
});

export interface MovimientoMetodo {
    id: number | string;
    tipo: 'VENTA' | 'ABONO' | 'COMPRA' | 'PAGO';
    referencia?: string;
    monto: number;
    metodo: 'EFECTIVO' | 'BAC' | 'LAFISE' | 'TARJETA' | 'OTRO';
    fecha?: string;
}

export interface ResumenMetodo {
    metodo: 'EFECTIVO' | 'BAC' | 'LAFISE' | 'TARJETA' | 'OTRO';
    nombre: string;
    entradas: number;
    salidas: number;
    neto: number;
}

export interface ReporteCierreBase {
    sesionid: number;
    nombreusuario: string;
    fechainicio: string;
    montoinicial: number;
    entradas: {
        ventas: { id: number; total: number }[];
        abonos: { id: number; total: number }[];
        totalVentas: number;
        totalAbonos: number;
        total: number;
    };
    salidas: {
        compras: { id: number; total: number }[];
        pagos: { id: number; total: number }[];
        totalCompras: number;
        totalPagos: number;
        total: number;
    };
    totalEsperado: number;
}

export interface ReporteCierreDetallado extends ReporteCierreBase {
    desgloseMetodos: ResumenMetodo[];
    movimientos: MovimientoMetodo[];
    totalEntradasGeneral: number;
    totalSalidasGeneral: number;
    totalNetoGeneral: number;
    totalEsperadoEfectivo: number;
}

export const normalizeMetodo = (m: string | undefined | null): 'EFECTIVO' | 'BAC' | 'LAFISE' | 'TARJETA' | 'OTRO' => {
    if (!m) return 'EFECTIVO';
    const upper = m.toUpperCase().trim();
    if (upper.includes('BAC')) return 'BAC';
    if (upper.includes('LAFISE')) return 'LAFISE';
    if (upper.includes('TARJETA') || upper.includes('POS') || upper.includes('CARD') || upper.includes('DEBIT') || upper.includes('CREDIT CARD')) return 'TARJETA';
    if (upper.includes('EFECTIVO') || upper.includes('CASH') || upper.includes('NIO') || upper.includes('USD')) return 'EFECTIVO';
    return 'OTRO';
};

export const buildReporteCierreConMetodos = async (sesionId: number, baseReporte: ReporteCierreBase): Promise<ReporteCierreDetallado> => {
    try {
        const [ventasRes, ventaPagosRes, comprasRes, pagosRes, abonosRes] = await Promise.all([
            api.get(`/ventas?sesionid=${sesionId}&limit=0`).catch(() => api.get('/ventas?limit=0')),
            api.get('/venta-pagos?limit=0').catch(() => ({ data: [] })),
            api.get('/compras?limit=0').catch(() => ({ data: [] })),
            api.get('/pagos?limit=0').catch(() => ({ data: [] })),
            api.get('/abonos?limit=0').catch(() => ({ data: [] })),
        ]);

        const allVentas: any[] = getArrayData(ventasRes.data, 'ventas');
        const sessionVentas = allVentas.filter(v =>
            Number(v.sesionid) === Number(sesionId) ||
            (baseReporte.entradas.ventas || []).some(bv => Number(bv.id) === Number(v.id ?? v.ventaid))
        );
        const sessionVentaIds = new Set(sessionVentas.map(v => Number(v.id ?? v.ventaid)));

        const allVentaPagos: any[] = getArrayData(ventaPagosRes.data, 'ventaPagos');
        const sessionVentaPagos = allVentaPagos.filter(vp => sessionVentaIds.has(Number(vp.ventaid)));

        const allCompras: any[] = getArrayData(comprasRes.data, 'compras');
        const sessionCompras = allCompras.filter(c => (baseReporte.salidas.compras || []).some(sc => Number(sc.id) === Number(c.id ?? c.compraid)));

        const allPagos: any[] = getArrayData(pagosRes.data, 'pagos');
        const sessionPagos = allPagos.filter(p => (baseReporte.salidas.pagos || []).some(sp => Number(sp.id) === Number(p.id ?? p.pagoid)));

        const allAbonos: any[] = getArrayData(abonosRes.data, 'abonos');
        const sessionAbonos = allAbonos.filter(a => (baseReporte.entradas.abonos || []).some(sa => Number(sa.id) === Number(a.id ?? a.abonoid)));

        const movimientos: MovimientoMetodo[] = [];

        // 1. Entradas por Ventas
        sessionVentas.forEach(v => {
            const vId = v.id ?? v.ventaid;
            const pagosDeVenta = sessionVentaPagos.filter(vp => Number(vp.ventaid) === Number(vId));
            if (pagosDeVenta.length > 0) {
                pagosDeVenta.forEach(vp => {
                    movimientos.push({
                        id: `V-${vId}-${vp.ventapagoid || vp.id}`,
                        tipo: 'VENTA',
                        referencia: vp.numerotransferencia ? `Venta #${vId} (Ref: ${vp.numerotransferencia})` : `Venta #${vId}`,
                        monto: Number(vp.monto || 0),
                        metodo: normalizeMetodo(vp.banco || vp.metodopago),
                        fecha: v.fecha
                    });
                });
            } else {
                movimientos.push({
                    id: `V-${vId}`,
                    tipo: 'VENTA',
                    referencia: v.numerotransferencia ? `Venta #${vId} (Ref: ${v.numerotransferencia})` : `Venta #${vId}`,
                    monto: Number(v.total || 0),
                    metodo: normalizeMetodo(v.metodopago),
                    fecha: v.fecha
                });
            }
        });

        // 2. Entradas por Abonos
        sessionAbonos.forEach(a => {
            const aId = a.id ?? a.abonoid;
            movimientos.push({
                id: `A-${aId}`,
                tipo: 'ABONO',
                referencia: `Abono a Cuenta #${aId}`,
                monto: Number(a.monto || a.total || 0),
                metodo: normalizeMetodo(a.metodopago),
                fecha: a.fecha
            });
        });

        // 3. Salidas por Compras (Solo compras al contado)
        sessionCompras.forEach(c => {
            if (c.tipocompra?.toUpperCase() === 'CREDITO' || c.metodopago?.toLowerCase() === 'credito') return;
            const cId = c.id ?? c.compraid;
            movimientos.push({
                id: `C-${cId}`,
                tipo: 'COMPRA',
                referencia: c.facturaproveedor ? `Compra #${cId} (Fact: ${c.facturaproveedor})` : `Compra #${cId}`,
                monto: Number(c.total || 0),
                metodo: normalizeMetodo(c.metodopago),
                fecha: c.fecha
            });
        });

        // 4. Salidas por Pagos/Gastos
        sessionPagos.forEach(p => {
            const pId = p.id ?? p.pagoid;
            movimientos.push({
                id: `P-${pId}`,
                tipo: 'PAGO',
                referencia: `Pago/Gasto #${pId}`,
                monto: Number(p.monto || p.total || 0),
                metodo: normalizeMetodo(p.metodopago),
                fecha: p.fecha
            });
        });

        // Resumen por Métodos
        const metodosLista: { metodo: 'EFECTIVO' | 'BAC' | 'LAFISE' | 'TARJETA' | 'OTRO'; nombre: string }[] = [
            { metodo: 'EFECTIVO', nombre: 'Efectivo en Caja' },
            { metodo: 'BAC', nombre: 'Banco BAC' },
            { metodo: 'LAFISE', nombre: 'Banco LAFISE' },
            { metodo: 'TARJETA', nombre: 'Tarjetas / POS' },
            { metodo: 'OTRO', nombre: 'Otras Transferencias' }
        ];

        const desgloseMetodos: ResumenMetodo[] = metodosLista.map(mItem => {
            const movs = movimientos.filter(m => m.metodo === mItem.metodo);
            const entradas = movs.filter(m => m.tipo === 'VENTA' || m.tipo === 'ABONO').reduce((sum, m) => sum + m.monto, 0);
            const salidas = movs.filter(m => m.tipo === 'COMPRA' || m.tipo === 'PAGO').reduce((sum, m) => sum + m.monto, 0);
            return {
                metodo: mItem.metodo,
                nombre: mItem.nombre,
                entradas,
                salidas,
                neto: entradas - salidas,
            };
        });

        const totalEntradasGeneral = desgloseMetodos.reduce((sum, d) => sum + d.entradas, 0);
        const totalSalidasGeneral = desgloseMetodos.reduce((sum, d) => sum + d.salidas, 0);
        const totalNetoGeneral = totalEntradasGeneral - totalSalidasGeneral;

        const efRow = desgloseMetodos.find(d => d.metodo === 'EFECTIVO');
        const totalEsperadoEfectivo = Number(baseReporte.montoinicial || 0) + (efRow ? efRow.neto : 0);

        return {
            ...baseReporte,
            desgloseMetodos,
            movimientos,
            totalEntradasGeneral,
            totalSalidasGeneral,
            totalNetoGeneral,
            totalEsperadoEfectivo: baseReporte.totalEsperado ?? totalEsperadoEfectivo,
        };
    } catch (err) {
        console.error('Error calculando desglose por método:', err);
        return {
            ...baseReporte,
            desgloseMetodos: [
                { metodo: 'EFECTIVO', nombre: 'Efectivo en Caja', entradas: baseReporte.entradas?.total || 0, salidas: baseReporte.salidas?.total || 0, neto: (baseReporte.entradas?.total || 0) - (baseReporte.salidas?.total || 0) },
                { metodo: 'BAC', nombre: 'Banco BAC', entradas: 0, salidas: 0, neto: 0 },
                { metodo: 'LAFISE', nombre: 'Banco LAFISE', entradas: 0, salidas: 0, neto: 0 },
                { metodo: 'TARJETA', nombre: 'Tarjetas / POS', entradas: 0, salidas: 0, neto: 0 },
                { metodo: 'OTRO', nombre: 'Otras Transferencias', entradas: 0, salidas: 0, neto: 0 },
            ],
            movimientos: [],
            totalEntradasGeneral: baseReporte.entradas?.total || 0,
            totalSalidasGeneral: baseReporte.salidas?.total || 0,
            totalNetoGeneral: (baseReporte.entradas?.total || 0) - (baseReporte.salidas?.total || 0),
            totalEsperadoEfectivo: baseReporte.totalEsperado || baseReporte.montoinicial || 0,
        };
    }
};

export const exportReporteCierrePDF = (data: ReporteCierreDetallado) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const mL = 14;
    const mR = 14;
    const cW = pageW - mL - mR;
    let curY = 14;
    const numBadgeR = 3.6;

    /* ── helpers ligados a esta instancia de doc ── */
    const { NAVY, SL600, SL500, SL400, SL300, SL200, SL50, WHITE, GREEN, GREEN_DARK, GREEN_BG, GREEN_BD, RED, RED_DARK, RED_BG, RED_BD, BLUE, BLUE_BG, BLUE_BD } = PDF_COLORS;
    const fill = (c: readonly number[]) => doc.setFillColor(c[0], c[1], c[2]);
    const draw = (c: readonly number[]) => doc.setDrawColor(c[0], c[1], c[2]);
    const txtC = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2]);
    const badge = (x: number, titleBaselineY: number, num: number) => drawSectionBadge(doc, x, titleBaselineY, numBadgeR, num);

    // =========================================
    //  HEADER (matching Ambienta POS design)
    // =========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    txtC(NAVY);
    doc.text('REPORTE DE CIERRE Y', mL, curY + 4);
    doc.text('CONCILIACIÓN DE CAJA', mL, curY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    txtC(SL500);
    doc.text(`Sesión #${data.sesionid}  |  Cajero / Usuario: ${data.nombreusuario || 'N/A'}`, mL, curY + 19);

    // Date box on right
    const dateBoxX = pageW - mR - 56;
    draw(SL300);
    doc.setLineWidth(0.4);
    doc.line(dateBoxX, curY + 1, dateBoxX, curY + 18);

    doc.setFontSize(7.5);
    txtC(SL500);
    doc.text('Fecha:', dateBoxX + 4, curY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    txtC(NAVY);
    const dateStr = new Date().toLocaleString('es-NI');
    doc.text(dateStr, dateBoxX + 4, curY + 12);

    // Bottom header line
    curY += 23;
    draw(SL200);
    doc.setLineWidth(0.3);
    doc.line(mL, curY, pageW - mR, curY);

    curY += 6;

    // =========================================
    //  SUMMARY METRIC CARDS (4 cards)
    // =========================================
    const cGap = 3.5;
    const cWid = (cW - cGap * 3) / 4;
    const cHei = 21;

    const cards = [
        {
            lbl: 'MONTO INICIAL',
            val: fmtMoney(data.montoinicial),
            accent: SL600,
            bg: SL50,
            bd: SL200,
            valColor: NAVY,
            icon: 'coin' as const,
        },
        {
            lbl: 'TOTAL ENTRADAS',
            val: fmtMoney(data.totalEntradasGeneral ?? data.entradas?.total),
            accent: GREEN,
            bg: GREEN_BG,
            bd: GREEN_BD,
            valColor: GREEN,
            icon: 'bag' as const,
        },
        {
            lbl: 'TOTAL SALIDAS',
            val: fmtMoney(data.totalSalidasGeneral ?? data.salidas?.total),
            accent: RED,
            bg: RED_BG,
            bd: RED_BD,
            valColor: RED,
            icon: 'arrow' as const,
        },
        {
            lbl: 'ESPERADO EN CAJA',
            val: fmtMoney(data.totalEsperadoEfectivo ?? data.totalEsperado),
            accent: BLUE,
            bg: BLUE_BG,
            bd: BLUE_BD,
            valColor: BLUE,
            icon: 'shield' as const,
        },
    ];

    cards.forEach((c, i) => {
        const x = mL + i * (cWid + cGap);
        fill(c.bg);
        draw(c.bd);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, curY, cWid, cHei, 2.5, 2.5, 'FD');

        CARD_ICONS[c.icon](doc, x + 6.5, curY + 7.2, c.accent);

        // Label
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        txtC(c.accent);
        doc.text(c.lbl, x + 13, curY + 7.5);

        // Value
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        txtC(c.valColor);
        doc.text(c.val, x + 13, curY + 16.5);
    });

    curY += cHei + 8;

    // =========================================
    //  SECTION 1: CONCILIACION
    // =========================================
    badge(mL, curY + 1.2, 1);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    txtC(NAVY);
    doc.text('CONCILIACIÓN POR MÉTODO DE PAGO Y BANCOS', mL + numBadgeR * 2 + 3.5, curY + 1.2);

    const titleWidth = doc.getTextWidth('CONCILIACIÓN POR MÉTODO DE PAGO Y BANCOS');
    const ruleStartX = mL + numBadgeR * 2 + 5.5 + titleWidth;
    draw(SL300);
    doc.setLineWidth(0.3);
    doc.line(ruleStartX, curY, pageW - mR, curY);

    curY += 5;

    const desglose = (data.desgloseMetodos && data.desgloseMetodos.length > 0)
        ? data.desgloseMetodos
        : [
            { nombre: 'Efectivo en Caja', entradas: Number(data.entradas?.total || 0), salidas: Number(data.salidas?.total || 0), neto: Number(data.entradas?.total || 0) - Number(data.salidas?.total || 0) },
            { nombre: 'Banco BAC', entradas: 0, salidas: 0, neto: 0 },
            { nombre: 'Banco LAFISE', entradas: 0, salidas: 0, neto: 0 },
            { nombre: 'Tarjetas / POS', entradas: 0, salidas: 0, neto: 0 },
            { nombre: 'Otras Transferencias', entradas: 0, salidas: 0, neto: 0 },
        ];

    autoTable(doc, {
        startY: curY,
        margin: { left: mL, right: mR },
        ...baseTableStyles(8.5),
        columnStyles: {
            0: { halign: 'left' as const },
            1: { cellWidth: 38, halign: 'right' as const },
            2: { cellWidth: 38, halign: 'right' as const },
            3: { cellWidth: 38, halign: 'right' as const },
        },
        head: [['Método / Entidad', 'Entradas', 'Salidas', 'Flujo Neto']],
        body: desglose.map(m => [
            m.nombre,
            fmtMoney(m.entradas),
            fmtMoney(m.salidas),
            fmtMoney(m.neto),
        ]),
        foot: [[
            'TOTAL CONSOLIDADO',
            fmtMoney(Number(data.totalEntradasGeneral ?? 0)),
            fmtMoney(Number(data.totalSalidasGeneral ?? 0)),
            fmtMoney(Number(data.totalNetoGeneral ?? 0)),
        ]],
        footStyles: {
            fillColor: WHITE as any,
            textColor: NAVY as any,
            fontStyle: 'bold',
            fontSize: 9,
            lineWidth: { top: 0.5 },
            lineColor: SL300 as any,
        },
        didParseCell: (hookData: CellHookData) => {
            if (hookData.section === 'body') {
                if (hookData.column.index === 1) hookData.cell.styles.textColor = GREEN as any;
                if (hookData.column.index === 2) hookData.cell.styles.textColor = RED as any;
                if (hookData.column.index === 3) {
                    const m = desglose[hookData.row.index];
                    hookData.cell.styles.fontStyle = 'bold';
                    hookData.cell.styles.textColor = (m && m.neto >= 0 ? GREEN : RED) as any;
                }
            }
            if (hookData.section === 'foot') {
                if (hookData.column.index === 1) hookData.cell.styles.textColor = GREEN as any;
                if (hookData.column.index === 2) hookData.cell.styles.textColor = RED as any;
                if (hookData.column.index === 3) {
                    hookData.cell.styles.textColor = (Number(data.totalNetoGeneral ?? 0) >= 0 ? GREEN : RED) as any;
                }
            }
        },
    });

    curY = ((doc as any).lastAutoTable?.finalY ?? curY) + 6;

    // =========================================
    //  ARQUEO DE CAJA FISICA (matching media_1789492186466.png)
    // =========================================
    const efRow = desglose.find(d => d.nombre?.toUpperCase().includes('EFECTIVO') || (d as any).metodo === 'EFECTIVO');
    const efEnt = efRow?.entradas || 0;
    const efSal = efRow?.salidas || 0;
    const resultado = Number(data.totalEsperadoEfectivo ?? (Number(data.montoinicial || 0) + efEnt - efSal));

    const aH = 18;
    if (curY + aH > pageH - 30) {
        doc.addPage();
        curY = 18;
    }

    fill([240, 253, 250]); // #f0fdf4
    draw(GREEN_BD);
    doc.setLineWidth(0.35);
    doc.roundedRect(mL, curY, cW, aH, 2.5, 2.5, 'FD');

    // Green check circle icon
    const checkR = 4;
    const checkX = mL + 8;
    const checkY = curY + aH / 2;
    doc.circle(checkX, checkY, checkR, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    txtC(WHITE);
    doc.text('✓', checkX, checkY + 2.2, { align: 'center' });

    // Title
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    txtC(GREEN_DARK);
    doc.text('ARQUEO DE CAJA FÍSICA', checkX + checkR + 3.5, curY + 6.5);

    // Formula subtitle (clean, no overflow)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    txtC(SL600);
    const formulaStr = `(${fmtMoney(data.montoinicial)}) + (${fmtMoney(efEnt)}) - (${fmtMoney(efSal)})`;
    doc.text(formulaStr, checkX + checkR + 3.5, curY + 13.5);

    // Vertical divider line before Resultado
    const resBoxW = 46;
    const resLineX = pageW - mR - resBoxW;
    draw(GREEN_BD);
    doc.setLineWidth(0.3);
    doc.line(resLineX, curY + 2.5, resLineX, curY + aH - 2.5);

    // Resultado label & value
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    txtC(GREEN_DARK);
    doc.text('Resultado:', resLineX + 5, curY + 6.5);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    txtC(GREEN_DARK);
    doc.text(fmtMoney(resultado), pageW - mR - 5, curY + 14, { align: 'right' });

    curY += aH + 8;

    // =========================================
    //  SECTION 2: MOVIMIENTOS DETALLADOS
    // =========================================
    if (curY + 25 > pageH - 30) {
        doc.addPage();
        curY = 18;
    }

    badge(mL, curY + 1.2, 2);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    txtC(NAVY);
    doc.text('DETALLE DE MOVIMIENTOS DE LA SESIÓN', mL + numBadgeR * 2 + 3.5, curY + 1.2);

    const title2Width = doc.getTextWidth('DETALLE DE MOVIMIENTOS DE LA SESIÓN');
    const rule2StartX = mL + numBadgeR * 2 + 5.5 + title2Width;
    draw(SL300);
    doc.setLineWidth(0.3);
    doc.line(rule2StartX, curY, pageW - mR, curY);

    curY += 5;

    const movs = data.movimientos || [];
    autoTable(doc, {
        startY: curY,
        margin: { left: mL, right: mR },
        ...baseTableStyles(8),
        columnStyles: {
            0: { cellWidth: 26, halign: 'center' as const },
            1: { halign: 'left' as const },
            2: { cellWidth: 32, halign: 'left' as const },
            3: { cellWidth: 38, halign: 'right' as const },
        },
        head: [['Tipo', 'Referencia / Concepto', 'Método', 'Monto']],
        body: movs.length > 0
            ? movs.map(m => {
                const isE = m.tipo === 'VENTA' || m.tipo === 'ABONO';
                return [
                    m.tipo,
                    m.referencia || '',
                    m.metodo,
                    `${isE ? '+' : '-'} ${fmtMoney(m.monto)}`,
                ];
            })
            : [['—', 'Sin movimientos registrados en la sesión.', '—', '—']],
        didParseCell: (hookData: CellHookData) => {
            if (hookData.section !== 'body' || movs.length === 0) return;
            const mov = movs[hookData.row.index];
            if (!mov) return;
            const isE = mov.tipo === 'VENTA' || mov.tipo === 'ABONO';
            if (hookData.column.index === 0) {
                hookData.cell.styles.fontStyle = 'bold';
                hookData.cell.styles.textColor = (isE ? GREEN_DARK : RED_DARK) as any;
                hookData.cell.styles.fillColor = (isE ? [220, 252, 231] : [254, 226, 226]) as any;
            }
            if (hookData.column.index === 3) {
                hookData.cell.styles.fontStyle = 'bold';
                hookData.cell.styles.textColor = (isE ? GREEN : RED) as any;
            }
        },
    });

    curY = ((doc as any).lastAutoTable?.finalY ?? curY) + 8;

    // =========================================
    //  SIGNATURES
    // =========================================
    if (curY + 22 > pageH - 20) {
        doc.addPage();
        curY = 25;
    } else {
        curY = Math.max(curY + 5, pageH - 35);
    }

    draw(SL300);
    doc.setLineWidth(0.3);
    const sigW = 56;
    const sig1X = mL + 16;
    const sig2X = pageW - mR - sigW - 16;
    doc.line(sig1X, curY, sig1X + sigW, curY);
    doc.line(sig2X, curY, sig2X + sigW, curY);

    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    txtC(SL500);
    doc.text('Firma Cajero(a)', sig1X + sigW / 2, curY + 4.5, { align: 'center' });
    doc.text('Firma Supervisor / Admin', sig2X + sigW / 2, curY + 4.5, { align: 'center' });

    // =========================================
    //  PAGE FOOTERS (every page)
    // =========================================
    const totalPgs = doc.getNumberOfPages();
    for (let p = 1; p <= totalPgs; p++) {
        doc.setPage(p);
        draw(SL200);
        doc.setLineWidth(0.25);
        doc.line(mL, pageH - 10, pageW - mR, pageH - 10);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        txtC(SL400);
        doc.text('Reporte generado automáticamente por el sistema.', mL, pageH - 6.5);
        doc.text(`Página ${p} de ${totalPgs}`, pageW - mR, pageH - 6.5, { align: 'right' });
    }

    // =========================================
    //  ROBUST DOWNLOAD TRIGGER
    // =========================================
    const fileName = `Cierre_Caja_Sesion_${data.sesionid || 'reporte'}_${new Date().toISOString().split('T')[0]}.pdf`;
    try {
        doc.save(fileName);
    } catch (saveErr) {
        console.warn('doc.save failed, executing Blob fallback:', saveErr);
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 500);
    }
};

export const exportReporteCierreExcel = (data: ReporteCierreDetallado) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Resumen por Método
    const resumenData = [
        ['REPORTE DE CIERRE Y CONCILIACIÓN DE CAJA'],
        [`Sesión #${data.sesionid}`, `Usuario: ${data.nombreusuario}`, `Fecha: ${new Date().toLocaleString('es-NI')}`],
        [],
        ['RESUMEN GENERAL'],
        ['Monto Inicial en Caja', Number(data.montoinicial || 0)],
        ['Total Entradas', Number(data.totalEntradasGeneral ?? data.entradas?.total ?? 0)],
        ['Total Salidas', Number(data.totalSalidasGeneral ?? data.salidas?.total ?? 0)],
        ['Total Esperado en Caja Física', Number(data.totalEsperadoEfectivo ?? data.totalEsperado ?? 0)],
        [],
        ['DESGLOSE POR MÉTODO DE PAGO Y BANCOS'],
        ['Método / Entidad', 'Entradas (+)', 'Salidas (-)', 'Flujo Neto'],
        ...(data.desgloseMetodos || []).map(m => [
            m.nombre,
            m.entradas,
            m.salidas,
            m.neto
        ]),
        ['TOTAL GENERAL', data.totalEntradasGeneral, data.totalSalidasGeneral, data.totalNetoGeneral]
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Metodos');

    // Sheet 2: Movimientos
    const movimientosData = [
        ['Tipo', 'Referencia / Concepto', 'Método de Pago', 'Monto (C$)', 'Fecha'],
        ...(data.movimientos || []).map(m => [
            m.tipo,
            m.referencia || '',
            m.metodo,
            m.monto,
            m.fecha ? new Date(m.fecha).toLocaleString('es-NI') : ''
        ])
    ];
    const wsMovs = XLSX.utils.aoa_to_sheet(movimientosData);
    XLSX.utils.book_append_sheet(wb, wsMovs, 'Movimientos Detallados');

    XLSX.writeFile(wb, `Cierre_Caja_Sesion_${data.sesionid}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
