import { useRef } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import api from '../../api/axios';
import type { LineaCompra } from './types';

export function useExcelImport(
    setLineas: React.Dispatch<React.SetStateAction<LineaCompra[]>>,
    setProductQueue: React.Dispatch<React.SetStateAction<string[]>>,
    setPendingBarcode: (v: string) => void,
    setProductForm: React.Dispatch<React.SetStateAction<{ nombre: string; preciocompra: string; precioventa: string; codigobarra: string; categoriaid: string; stockactual: string; stockminimo: string; descripcion: string }>>,
    setShowProductModal: (v: boolean) => void,
) {
    const excelInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ['codigobarra', 'nombre_producto', 'cantidad', 'precio_unitario', 'descuento'],
            ['123456789', 'Ejemplo Producto', 10, 25.50, 0],
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'Compra');
        XLSX.writeFile(wb, 'plantilla_compra.xlsx');
    };

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws);

        const newBarcodes: string[] = [];
        const resolved: LineaCompra[] = [];

        for (const row of rows) {
            const codigo = String(row['codigobarra'] || '').trim();
            const cantidad = Number(row['cantidad']) || 1;
            const precioUnitario = Number(row['precio_unitario']) || 0;
            const descuento = Number(row['descuento']) || 0;
            if (!codigo) continue;
            try {
                const res = await api.get(`/productos/barcode/${codigo}`).catch(() => api.get(`/productos/${codigo}`));
                const d = res.data;
                resolved.push({
                    producto: {
                        id: d.id ?? d.productoid,
                        nombre: d.nombre,
                        codigobarra: d.codigobarra,
                        preciocompra: Number(d.preciocompra),
                        precioventa: Number(d.precioventa),
                    },
                    cantidad,
                    preciounitario: precioUnitario || Number(d.preciocompra),
                    descuento,
                });
            } catch {
                newBarcodes.push(codigo);
            }
        }

        if (resolved.length > 0) setLineas(prev => [...prev, ...resolved]);

        if (newBarcodes.length > 0) {
            const [first, ...rest] = newBarcodes;
            setProductQueue(rest);
            setPendingBarcode(first);
            setProductForm(p => ({ ...p, codigobarra: first, nombre: '' }));
            setShowProductModal(true);
        } else if (resolved.length > 0) {
            Swal.fire({ icon: 'success', title: `${resolved.length} producto(s) cargados desde Excel`, timer: 1500, showConfirmButton: false });
        }
    };

    return { excelInputRef, downloadTemplate, handleExcelUpload };
}
