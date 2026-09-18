import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';
import type { Product } from './types';

export interface LabelSizeConfig {
    cols: number;
    rows: number;
    labelWidth: number;
    labelHeight: number;
}

export interface LabelPreset extends LabelSizeConfig {
    id: string;
    nombre: string;
}

export const LABEL_PRESETS: LabelPreset[] = [
    { id: '3x8', nombre: '3 × 8 — Estándar (56 × 29 mm)', cols: 3, rows: 8, labelWidth: 56, labelHeight: 29 },
    { id: '2x7', nombre: '2 × 7 — Grande (85 × 34 mm)', cols: 2, rows: 7, labelWidth: 85, labelHeight: 34 },
    { id: '2x5', nombre: '2 × 5 — Extra Grande (90 × 50 mm)', cols: 2, rows: 5, labelWidth: 90, labelHeight: 50 },
    { id: 'custom', nombre: 'Personalizado', cols: 3, rows: 8, labelWidth: 56, labelHeight: 29 },
];

const LETTER_PAGE_MM = { width: 215.9, height: 279.4 };
const PAGE_MARGIN_MM = 6;
const MIN_LABEL_GAP_MM = 2;
const MAX_LABEL_GAP_MM = 14;

/** Centra una grilla cols×rows de etiquetas en una hoja carta, repartiendo el espacio sobrante como separación. */
export function computeLabelGridLayout(config: LabelSizeConfig): { startX: number; startY: number; gapX: number; gapY: number } | null {
    const { cols, rows, labelWidth, labelHeight } = config;
    const availW = LETTER_PAGE_MM.width - PAGE_MARGIN_MM * 2;
    const availH = LETTER_PAGE_MM.height - PAGE_MARGIN_MM * 2;
    const neededW = cols * labelWidth + (cols - 1) * MIN_LABEL_GAP_MM;
    const neededH = rows * labelHeight + (rows - 1) * MIN_LABEL_GAP_MM;
    if (cols < 1 || rows < 1 || labelWidth <= 0 || labelHeight <= 0 || neededW > availW || neededH > availH) {
        return null;
    }
    const gapX = cols > 1 ? Math.min(MAX_LABEL_GAP_MM, (availW - cols * labelWidth) / (cols - 1)) : 0;
    const gapY = rows > 1 ? Math.min(MAX_LABEL_GAP_MM, (availH - rows * labelHeight) / (rows - 1)) : 0;
    const totalW = cols * labelWidth + (cols - 1) * gapX;
    const totalH = rows * labelHeight + (rows - 1) * gapY;
    return {
        startX: (LETTER_PAGE_MM.width - totalW) / 2,
        startY: (LETTER_PAGE_MM.height - totalH) / 2,
        gapX,
        gapY,
    };
}

export function useBarcodesTab(products: Product[]) {
    const [barcodeSearch, setBarcodeSearch] = useState('');
    const [barcodeCategoryFilter, setBarcodeCategoryFilter] = useState('');
    const [selectedBarcodes, setSelectedBarcodes] = useState<Record<number, number>>({});
    const [includePriceInPdf, setIncludePriceInPdf] = useState(true);
    const [includeNameInPdf, setIncludeNameInPdf] = useState(true);

    // Tamaño de etiqueta (configurable)
    const [labelPresetId, setLabelPresetId] = useState('3x8');
    const [customLabelConfig, setCustomLabelConfig] = useState<LabelSizeConfig>({ cols: 3, rows: 8, labelWidth: 56, labelHeight: 29 });

    const activeLabelConfig: LabelSizeConfig = useMemo(() => {
        if (labelPresetId === 'custom') return customLabelConfig;
        return LABEL_PRESETS.find(p => p.id === labelPresetId) || LABEL_PRESETS[0];
    }, [labelPresetId, customLabelConfig]);

    const labelGridLayout = useMemo(() => computeLabelGridLayout(activeLabelConfig), [activeLabelConfig]);

    const updateCustomLabelConfig = (field: keyof LabelSizeConfig, value: number) => {
        setCustomLabelConfig(prev => ({ ...prev, [field]: Math.max(field === 'cols' || field === 'rows' ? 1 : 5, value) }));
    };

    const filteredBarcodeProducts = products.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(barcodeSearch.toLowerCase()) ||
            (p.codigobarra && p.codigobarra.toLowerCase().includes(barcodeSearch.toLowerCase()));
        const matchCat = barcodeCategoryFilter ? String(p.categoriaid) === barcodeCategoryFilter : true;
        return matchSearch && matchCat;
    });

    const selectAllVisible = () => {
        const map: Record<number, number> = { ...selectedBarcodes };
        filteredBarcodeProducts.forEach(p => { map[p.id] = (map[p.id] || 0) > 0 ? map[p.id] : 1; });
        setSelectedBarcodes(map);
    };

    const deselectAll = () => setSelectedBarcodes({});

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            const map: Record<number, number> = {};
            products.forEach(p => { map[p.id] = selectedBarcodes[p.id] || 1; });
            setSelectedBarcodes(map);
        } else {
            setSelectedBarcodes({});
        }
    };

    const generateBulkPDF = () => {
        const itemsToExport: { product: Product; count: number }[] = [];
        products.forEach(p => {
            const count = selectedBarcodes[p.id] || 0;
            if (count > 0) {
                itemsToExport.push({ product: p, count });
            }
        });
        if (itemsToExport.length === 0) {
            Swal.fire('Atención', 'Seleccione al menos un producto aumentando la cantidad de etiquetas.', 'info');
            return;
        }

        const layout = computeLabelGridLayout(activeLabelConfig);
        if (!layout) {
            Swal.fire('Tamaño inválido', 'Las etiquetas configuradas (columnas × filas × tamaño) no caben en una hoja carta. Reduce el tamaño o la cantidad de columnas/filas.', 'error');
            return;
        }

        const { cols, rows, labelWidth, labelHeight } = activeLabelConfig;
        const { startX, startY, gapX, gapY } = layout;
        // Factores de escala respecto al tamaño de referencia (56×29mm) para que el
        // texto y el código de barras crezcan proporcionalmente en etiquetas más grandes.
        const scaleW = labelWidth / 56;
        const scaleH = labelHeight / 29;
        const scale = Math.min(scaleW, scaleH);

        // Generate PDF with jsPDF (Letter: 215.9mm x 279.4mm)
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

        let flatItems: Product[] = [];
        itemsToExport.forEach(it => {
            for (let i = 0; i < it.count; i++) {
                flatItems.push(it.product);
            }
        });

        let currentIndex = 0;
        while (currentIndex < flatItems.length) {
            if (currentIndex > 0) {
                doc.addPage();
            }
            for (let r = 0; r < rows && currentIndex < flatItems.length; r++) {
                for (let c = 0; c < cols && currentIndex < flatItems.length; c++) {
                    const p = flatItems[currentIndex];
                    const x = startX + c * (labelWidth + gapX);
                    const y = startY + r * (labelHeight + gapY);

                    // Draw label border box
                    doc.setDrawColor(210, 215, 220);
                    doc.setLineWidth(0.2);
                    doc.roundedRect(x, y, labelWidth, labelHeight, 1.5, 1.5);

                    let curY = y + 4.5 * scaleH;
                    if (includeNameInPdf) {
                        doc.setFontSize(7.5 * scale);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(30, 41, 59);
                        const maxChars = Math.round(22 * scaleW);
                        const tName = p.nombre.length > maxChars ? p.nombre.substring(0, maxChars - 2) + '..' : p.nombre;
                        doc.text(tName, x + labelWidth / 2, curY, { align: 'center' });
                        curY += 1.5 * scaleH;
                    }

                    // High-res barcode generation on canvas
                    const code = p.codigobarra || String(p.id).padStart(8, '0');
                    const canvas = document.createElement('canvas');
                    const isEan13 = code.length === 13 && /^\d+$/.test(code);
                    try {
                        JsBarcode(canvas, code, {
                            format: isEan13 ? 'EAN13' : 'CODE128',
                            width: 1.4 * scale,
                            height: 38 * scale,
                            displayValue: true,
                            fontSize: 9 * scale,
                            textMargin: 2,
                            margin: 2,
                            background: '#ffffff',
                            lineColor: '#000000',
                        });
                        const imgData = canvas.toDataURL('image/png', 1.0);
                        const barcodeWidth = Math.min(46 * scaleW, labelWidth - 4);
                        const barcodeX = x + (labelWidth - barcodeWidth) / 2;
                        doc.addImage(imgData, 'PNG', barcodeX, curY, barcodeWidth, 15 * scaleH, undefined, 'FAST');
                    } catch {
                        doc.setFontSize(8.5 * scale);
                        doc.text(`*${code}*`, x + labelWidth / 2, curY + 8 * scaleH, { align: 'center' });
                    }

                    if (includePriceInPdf) {
                        doc.setFontSize(8 * scale);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(16, 185, 129);
                        doc.text(`C$ ${Number(p.precioventa).toFixed(2)}`, x + labelWidth / 2, y + labelHeight - 2, { align: 'center' });
                    }

                    currentIndex++;
                }
            }
        }

        doc.save(`Codigos_Barra_${new Date().toISOString().split('T')[0]}.pdf`);
        Swal.fire({
            icon: 'success',
            title: '¡PDF Generado!',
            text: `Se exportaron ${flatItems.length} etiquetas correctamente en formato carta.`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const printSingleLabel = (p: Product) => {
        const displayCode = p.codigobarra || String(p.id).padStart(8, '0');
        // Formato Apaisado (Horizontal) estándar para impresoras de etiquetas (65mm x 35mm)
        const labelW = 65;
        const labelH = 35;
        const singleDoc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [labelH, labelW]
        });

        let startTop = 6;
        if (includeNameInPdf) {
            singleDoc.setFontSize(8);
            singleDoc.setFont('helvetica', 'bold');
            singleDoc.setTextColor(30, 41, 59);
            const truncName = p.nombre.length > 28 ? p.nombre.substring(0, 26) + '..' : p.nombre;
            singleDoc.text(truncName, labelW / 2, startTop, { align: 'center' });
            startTop += 2;
        }

        const canvas = document.createElement('canvas');
        const isEan13 = displayCode.length === 13 && /^\d+$/.test(displayCode);
        try {
            JsBarcode(canvas, displayCode, {
                format: isEan13 ? 'EAN13' : 'CODE128',
                width: 1.5,
                height: 40,
                displayValue: true,
                fontSize: 10,
                textMargin: 2,
                margin: 2,
                background: '#ffffff',
                lineColor: '#000000',
            });
            const imgData = canvas.toDataURL('image/png', 1.0);
            const barcodeWidth = 52;
            const barcodeX = (labelW - barcodeWidth) / 2;
            singleDoc.addImage(imgData, 'PNG', barcodeX, startTop, barcodeWidth, 17, undefined, 'FAST');
        } catch {
            singleDoc.setFontSize(9);
            singleDoc.text(`*${displayCode}*`, labelW / 2, startTop + 10, { align: 'center' });
        }

        if (includePriceInPdf) {
            singleDoc.setFontSize(9);
            singleDoc.setFont('helvetica', 'bold');
            singleDoc.setTextColor(16, 185, 129);
            singleDoc.text(`C$ ${Number(p.precioventa).toFixed(2)}`, labelW / 2, labelH - 3.5, { align: 'center' });
        }

        singleDoc.save(`Codigo_${p.nombre.replace(/\s+/g, '_')}.pdf`);
    };

    return {
        barcodeSearch, setBarcodeSearch,
        barcodeCategoryFilter, setBarcodeCategoryFilter,
        selectedBarcodes, setSelectedBarcodes,
        includePriceInPdf, setIncludePriceInPdf,
        includeNameInPdf, setIncludeNameInPdf,
        filteredBarcodeProducts,
        selectAllVisible, deselectAll, toggleSelectAll,
        generateBulkPDF, printSingleLabel,
        labelPresetId, setLabelPresetId,
        customLabelConfig, updateCustomLabelConfig,
        activeLabelConfig, labelGridLayout,
    };
}
