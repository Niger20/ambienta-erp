import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import api from '../../api/axios';
import type { Category } from './types';

export function useExcelImport(categories: Category[], fetchData: () => Promise<void>) {
    const excelInputRef = useRef<HTMLInputElement>(null);
    const [importProgress, setImportProgress] = useState<{ done: number; total: number; errors: number } | null>(null);
    const [pendingProducts, setPendingProducts] = useState<any[]>([]);
    const [showCatAssign, setShowCatAssign] = useState(false);
    const [catAssignMap, setCatAssignMap] = useState<Record<number, string>>({});

    const downloadProductTemplate = () => {
        const wb = XLSX.utils.book_new();
        // Sheet 1: data template
        const wsData = XLSX.utils.aoa_to_sheet([
            ['codigobarra', 'nombre', 'preciocompra', 'precioventa', 'stockactual', 'stockminimo', 'categoria', 'descripcion'],
            ['123456789', 'Ejemplo Producto', 20.00, 35.00, 50, 5, categories[0]?.name || 'General', 'Descripción opcional'],
        ]);
        XLSX.utils.book_append_sheet(wb, wsData, 'Productos');
        // Sheet 2: valid categories list
        const catRows: string[][] = [['Categorías válidas (copie el nombre exacto en la columna "categoria")'], ...categories.map(c => [c.name])];
        const wsCat = XLSX.utils.aoa_to_sheet(catRows);
        XLSX.utils.book_append_sheet(wb, wsCat, 'Categorías');
        XLSX.writeFile(wb, 'plantilla_productos.xlsx');
    };

    const createProductsBatch = async (products: any[]) => {
        let done = 0; let errors = 0;
        setImportProgress({ done: 0, total: products.length, errors: 0 });
        for (const payload of products) {
            const { _needsCat, _rawCat, ...cleanPayload } = payload;
            try { await api.post('/productos/', cleanPayload); done++; } catch { errors++; }
            setImportProgress({ done, total: products.length, errors });
        }
        setImportProgress(null);
        fetchData();
        Swal.fire({ icon: errors === 0 ? 'success' : 'warning', title: 'Importación completada', text: `${done} creados, ${errors} errores.`, timer: 3000, showConfirmButton: false });
    };

    const handleProductExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws);
        if (rows.length === 0) { Swal.fire('Aviso', 'El archivo está vacío o no tiene filas de datos.', 'warning'); return; }

        const catMap: Record<string, number> = {};
        categories.forEach(c => { catMap[c.name.toLowerCase().trim()] = c.id; });

        const ready: any[] = [];
        const needsCat: any[] = []; // products with unresolved categories

        for (const row of rows) {
            const nombre = String(row['nombre'] || '').trim();
            if (!nombre) continue;
            const payload: any = {
                nombre,
                preciocompra: Number(row['preciocompra']) || 0,
                precioventa: Number(row['precioventa']) || 0,
                stockactual: Number(row['stockactual']) || 0,
                stockminimo: Number(row['stockminimo']) || 0,
                descripcion: String(row['descripcion'] || ''),

            };
            if (row['codigobarra']) payload.codigobarra = String(row['codigobarra']).trim();
            const rawCat = row['categoria'] ? String(row['categoria']).toLowerCase().trim() : '';
            const catId = rawCat ? catMap[rawCat] : undefined;
            if (catId) {
                payload.categoriaid = catId;
                ready.push(payload);
            } else {
                // Category missing or invalid — queue for user assignment
                needsCat.push({ ...payload, _rawCat: row['categoria'] || '' });
            }
        }

        if (needsCat.length > 0) {
            // Show assignment modal before creating
            const all = [...ready.map(p => ({ ...p, _needsCat: false })), ...needsCat.map(p => ({ ...p, _needsCat: true }))];
            setPendingProducts(all);
            setCatAssignMap(Object.fromEntries(needsCat.map((_: any, i: number) => [ready.length + i, ''])));
            setShowCatAssign(true);
        } else {
            await createProductsBatch(ready);
        }
    };

    const handleConfirmCatAssign = async () => {
        const finalProducts = pendingProducts.map((p, i) => {
            const catId = catAssignMap[i] ? Number(catAssignMap[i]) : undefined;
            return catId ? { ...p, categoriaid: catId } : p;
        });
        setShowCatAssign(false);
        setPendingProducts([]);
        await createProductsBatch(finalProducts);
    };

    return {
        excelInputRef, importProgress,
        pendingProducts, showCatAssign, setShowCatAssign, catAssignMap, setCatAssignMap,
        downloadProductTemplate, handleProductExcelUpload, handleConfirmCatAssign,
    };
}
