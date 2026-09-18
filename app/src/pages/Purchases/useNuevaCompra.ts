import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { CostoAdicionalItem, LineaCompra, Proveedor, Producto } from './types';

interface SavedPurchaseState {
    lineas?: LineaCompra[];
    selectedProveedor?: string;
    tipoCompra?: 'CONTADO' | 'CREDITO';
    metodoPago?: string;
    facturaProveedor?: string;
    costosAdicionales?: CostoAdicionalItem[];
    ordenCompraIdActiva?: number | null;
}

export function useNuevaCompra(
    lineas: LineaCompra[],
    setLineas: React.Dispatch<React.SetStateAction<LineaCompra[]>>,
    proveedores: Proveedor[],
    setShowProductModal: (v: boolean) => void,
    setPendingBarcode: (v: string) => void,
    setProductForm: React.Dispatch<React.SetStateAction<{ nombre: string; preciocompra: string; precioventa: string; codigobarra: string; categoriaid: string; stockactual: string; stockminimo: string; descripcion: string }>>,
) {
    // ── Restore from sessionStorage ──
    const savedPurchase: SavedPurchaseState = (() => { try { return JSON.parse(sessionStorage.getItem('purchase_state') || 'null'); } catch { return null; } })() || {};

    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Producto[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState(savedPurchase?.selectedProveedor || '');
    const [busquedaProveedor, setBusquedaProveedor] = useState('');
    const [showProveedoresDropdown, setShowProveedoresDropdown] = useState(false);
    const [supplierFocusedIndex, setSupplierFocusedIndex] = useState<number>(-1);
    const [searchFocusedIndex, setSearchFocusedIndex] = useState<number>(-1);
    const [tipoCompra, setTipoCompra] = useState<'CONTADO' | 'CREDITO'>(savedPurchase?.tipoCompra || 'CONTADO');
    const [metodoPago, setMetodoPago] = useState(savedPurchase?.metodoPago || 'efectivo');
    const [facturaProveedor, setFacturaProveedor] = useState(savedPurchase?.facturaProveedor || '');
    const [cuotas, setCuotas] = useState<number>(1);
    const [fechaVencimiento, setFechaVencimiento] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Costos Adicionales de la Compra (Landed Costs)
    const [costosAdicionales, setCostosAdicionales] = useState<CostoAdicionalItem[]>(savedPurchase?.costosAdicionales || []);

    const [ordenCompraIdActiva, setOrdenCompraIdActiva] = useState<number | null>(savedPurchase?.ordenCompraIdActiva || null);

    // ── Save to sessionStorage ──
    useEffect(() => {
        sessionStorage.setItem('purchase_state', JSON.stringify({ lineas, selectedProveedor, tipoCompra, metodoPago, facturaProveedor, costosAdicionales, ordenCompraIdActiva }));
    }, [lineas, selectedProveedor, tipoCompra, metodoPago, facturaProveedor, costosAdicionales, ordenCompraIdActiva]);

    /* ── Barcode Search ── */
    const buscarProducto = useCallback(async (codigo: string) => {
        const trimmed = codigo.trim();
        if (!trimmed) return;
        setIsSearching(true);
        setShowSearchDropdown(false);
        setSearchResults([]);
        setSearchFocusedIndex(-1);

        const isNumeric = /^\d+$/.test(trimmed);
        let res;

        try {
            if (isNumeric) {
                // Try barcode first, then ID
                res = await api.get(`/productos/barcode/${trimmed}`).catch(() => {
                    return api.get(`/productos/${trimmed}`);
                });
            } else {
                // Non-numeric: try barcode first, if fails search by name
                try {
                    res = await api.get(`/productos/barcode/${trimmed}`);
                } catch {
                    // Search by name
                    const searchRes = await api.get(`/productos/search?q=${encodeURIComponent(trimmed)}`);
                    const results: any[] = searchRes.data || [];
                    if (results.length === 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Producto no encontrado',
                            text: `No se encontró el producto: "${trimmed}"`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        setIsSearching(false);
                        setInputValue('');
                        inputRef.current?.focus();
                        return;
                    }
                    if (results.length === 1) {
                        // Single result, add directly
                        res = { data: results[0] };
                    } else {
                        // Multiple results, show dropdown
                        const mapped = results.map((data: any) => ({
                            id: data.id ?? data.productoid,
                            nombre: data.nombre,
                            codigobarra: data.codigobarra,
                            precioventa: Number(data.precioventa),
                            preciocompra: Number(data.preciocompra),
                            stockactual: data.stockactual != null ? Number(data.stockactual) : null,
                            categorianombre: data.categorianombre ?? data.categoriasproductos?.nombre ?? null,
                        }));
                        setSearchResults(mapped);
                        setShowSearchDropdown(true);
                        setIsSearching(false);
                        return;
                    }
                }
            }

            const data = res.data;
            const producto: Producto = {
                id: data.id ?? data.productoid,
                nombre: data.nombre,
                codigobarra: data.codigobarra,
                preciocompra: Number(data.preciocompra),
                precioventa: Number(data.precioventa),
                stockactual: data.stockactual,
                categorianombre: data.categorianombre ?? data.categoriasproductos?.nombre,
            };
            setLineas(prev => {
                const idx = prev.findIndex(l => l.producto.id === producto.id);
                if (idx >= 0) {
                    const copy = [...prev];
                    if (copy[idx].cantidad + 1 > 10000) {
                        Swal.fire({ icon: 'error', title: 'Aviso', text: 'La cantidad máxima permitida es 10000.', timer: 2000, showConfirmButton: false });
                        return prev;
                    }
                    copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + 1 };
                    return copy;
                }
                return [...prev, { producto, cantidad: 1, preciounitario: producto.preciocompra, descuento: 0 }];
            });
        } catch {
            // Product not found — open registration modal
            setPendingBarcode(trimmed);
            setProductForm(p => ({ ...p, codigobarra: trimmed, nombre: '', preciocompra: '', precioventa: '' }));
            setShowProductModal(true);
        } finally {
            setIsSearching(false);
            setInputValue('');
            inputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const agregarProductoALineas = (producto: Producto) => {
        setLineas(prev => {
            const idx = prev.findIndex(l => l.producto.id === producto.id);
            if (idx >= 0) {
                const copy = [...prev];
                if (copy[idx].cantidad + 1 > 10000) {
                    Swal.fire({ icon: 'error', title: 'Aviso', text: 'La cantidad máxima permitida es 10000.', timer: 2000, showConfirmButton: false });
                    return prev;
                }
                copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + 1 };
                return copy;
            }
            return [...prev, { producto, cantidad: 1, preciounitario: producto.preciocompra, descuento: 0 }];
        });
        setShowSearchDropdown(false);
        setSearchResults([]);
        setSearchFocusedIndex(-1);
        setInputValue('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSearchDropdown && searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSearchFocusedIndex(prev => (prev + 1) % searchResults.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSearchFocusedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
                return;
            }
            if (e.key === 'Enter') {
                if (searchFocusedIndex >= 0 && searchFocusedIndex < searchResults.length) {
                    e.preventDefault();
                    agregarProductoALineas(searchResults[searchFocusedIndex]);
                    return;
                }
            }
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            setShowSearchDropdown(false);
            setSearchResults([]);
            buscarProducto(inputValue);
        }
        if (e.key === 'Escape') {
            setShowSearchDropdown(false);
            setSearchResults([]);
            setSearchFocusedIndex(-1);
        }
    };

    // Debounced live search as user types (only for non-numeric input)
    useEffect(() => {
        setSearchFocusedIndex(-1);
        const trimmed = inputValue.trim();
        const isNumeric = /^\d+$/.test(trimmed);

        // Only trigger live search for non-numeric input >= 2 chars
        if (isNumeric || trimmed.length < 2) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/productos/search?q=${encodeURIComponent(trimmed)}`);
                const results: any[] = res.data || [];
                if (results.length > 0) {
                    const mapped = results.map((data: any) => ({
                        id: data.id ?? data.productoid,
                        nombre: data.nombre,
                        codigobarra: data.codigobarra,
                        precioventa: Number(data.precioventa),
                        preciocompra: Number(data.preciocompra),
                        stockactual: data.stockactual != null ? Number(data.stockactual) : null,
                        categorianombre: data.categorianombre ?? data.categoriasproductos?.nombre ?? null,
                    }));
                    setSearchResults(mapped);
                    setShowSearchDropdown(true);
                } else {
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                }
            } catch {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const removeLine = (idx: number) => setLineas(prev => prev.filter((_, i) => i !== idx));

    const updateLinea = (idx: number, field: 'cantidad' | 'preciounitario' | 'descuento', value: number) => {
        if (field === 'cantidad' && value > 10000) {
            Swal.fire({ icon: 'error', title: 'Aviso', text: 'La cantidad máxima permitida es 10000.', timer: 2000, showConfirmButton: false });
            return;
        }
        setLineas(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], [field]: value }; return copy; });
    };

    /* ── Costos Adicionales Handlers ── */
    const handleAddCostoAdicional = () => {
        setCostosAdicionales(prev => [...prev, { id: Date.now().toString(), concepto: '', monto: '' }]);
    };

    const handleRemoveCostoAdicional = (id: string) => {
        setCostosAdicionales(prev => prev.filter(c => c.id !== id));
    };

    const handleUpdateCostoAdicional = (id: string, field: 'concepto' | 'monto', val: string) => {
        setCostosAdicionales(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    };

    const subtotalLineas = useMemo(() => lineas.reduce((sum, l) => sum + (l.preciounitario * l.cantidad), 0), [lineas]);
    const totalDescuentosLineas = useMemo(() => lineas.reduce((sum, l) => sum + (Number(l.descuento) || 0), 0), [lineas]);
    const total = Math.max(0, subtotalLineas - totalDescuentosLineas);
    const totalCostosAdicionales = useMemo(() => costosAdicionales.reduce((sum, c) => sum + (parseFloat(c.monto) || 0), 0), [costosAdicionales]);
    const costoTotalAdquisicion = total + totalCostosAdicionales;

    const proveedoresFiltradosDropdown = useMemo(() => {
        if (!busquedaProveedor) return proveedores.slice(0, 10);
        const lower = busquedaProveedor.toLowerCase();
        return proveedores.filter(p =>
            p.nombreempresa.toLowerCase().includes(lower) ||
            (p.asesorventas || '').toLowerCase().includes(lower)
        ).slice(0, 10);
    }, [proveedores, busquedaProveedor]);

    /* ── Guardar Compra ── */
    const handleGuardarCompra = async () => {
        if (lineas.length === 0) { Swal.fire('Aviso', 'Agregue al menos un producto.', 'warning'); return; }
        if (!selectedProveedor) { Swal.fire('Aviso', 'Seleccione un proveedor.', 'warning'); return; }
        setIsSaving(true);
        try {
            const totalCompra = total;
            const compraRes = await api.post('/compras', {
                proveedorid: Number(selectedProveedor),
                total: totalCompra,
                metodopago: metodoPago,
                tipocompra: tipoCompra,
                facturaproveedor: facturaProveedor || null,
                ordencompraid: ordenCompraIdActiva || null,
            });
            const compra = compraRes.data;
            const compraId = compra.id ?? compra.compraid;

            await Promise.all(lineas.map(l => api.post('/compras-productos', {
                compraid: compraId,
                productoid: l.producto.id,
                cantidad: l.cantidad,
                preciounitario: l.preciounitario,
                descuento: l.descuento,
            })));

            // Registrar costos adicionales
            for (const ca of costosAdicionales) {
                const m = parseFloat(ca.monto) || 0;
                if (m > 0 && ca.concepto.trim()) {
                    await api.post('/costos-adicionales-compras', {
                        compraid: compraId,
                        concepto: ca.concepto.trim(),
                        monto: m,
                    });
                }
            }

            // Si proviene de una orden de compra, actualizar estado a RECIBIDA_TOTAL
            if (ordenCompraIdActiva) {
                try {
                    await api.put(`/ordenes-compra/${ordenCompraIdActiva}`, {
                        estado: 'RECIBIDA_TOTAL',
                    });
                } catch (orderErr) {
                    console.warn('No se pudo actualizar el estado de la orden de compra:', orderErr);
                }
            }

            if (tipoCompra === 'CREDITO') {
                await api.post('/cuentas-por-pagar', {
                    compraid: compraId,
                    montototal: totalCompra,
                    fechavencimiento: fechaVencimiento,
                    cuotas: cuotas > 0 ? cuotas : 1,
                    estado: 'PENDIENTE',
                });
            }

            Swal.fire({ icon: 'success', title: 'Compra registrada', timer: 1500, showConfirmButton: false });
            setLineas([]);
            setSelectedProveedor('');
            setFacturaProveedor('');
            setTipoCompra('CONTADO');
            setMetodoPago('efectivo');
            setCostosAdicionales([]);
            setOrdenCompraIdActiva(null);
            sessionStorage.removeItem('purchase_state');
        } catch (err: any) {
            console.error('Error al guardar compra:', err);
            const errData = err.response?.data?.error;
            const msg = typeof errData === 'string'
                ? errData
                : (errData && typeof errData === 'object' ? (errData.message || JSON.stringify(errData)) : (err.response?.data?.message || err.message || 'No se pudo guardar la compra.'));
            Swal.fire('Error', String(msg), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        lineas, setLineas,
        inputValue, setInputValue, isSearching, searchResults, setSearchResults,
        showSearchDropdown, setShowSearchDropdown, searchFocusedIndex,
        selectedProveedor, setSelectedProveedor,
        busquedaProveedor, setBusquedaProveedor,
        showProveedoresDropdown, setShowProveedoresDropdown, supplierFocusedIndex, setSupplierFocusedIndex,
        tipoCompra, setTipoCompra, metodoPago, setMetodoPago, facturaProveedor, setFacturaProveedor,
        cuotas, setCuotas, fechaVencimiento, setFechaVencimiento, isSaving, inputRef,
        costosAdicionales,
        ordenCompraIdActiva, setOrdenCompraIdActiva,
        buscarProducto, agregarProductoALineas, handleKeyDown, removeLine, updateLinea,
        handleAddCostoAdicional, handleRemoveCostoAdicional, handleUpdateCostoAdicional,
        subtotalLineas, totalDescuentosLineas, total, totalCostosAdicionales, costoTotalAdquisicion,
        proveedoresFiltradosDropdown,
        handleGuardarCompra,
    };
}
