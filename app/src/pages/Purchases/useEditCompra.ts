import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Compra, CostoAdicionalItem, LineaCompra, Producto } from './types';

export function useEditCompra(
    productosCatalogo: Producto[],
    fetchCompras: () => Promise<void>,
    fetchCuentasPorPagar: () => Promise<void>,
    fetchInitialData: () => Promise<void>,
) {
    const [showEditCompraModal, setShowEditCompraModal] = useState(false);
    const [editingCompra, setEditingCompra] = useState<Compra | null>(null);
    const [editLineas, setEditLineas] = useState<LineaCompra[]>([]);
    const [editSelectedProveedor, setEditSelectedProveedor] = useState<string>('');
    const [editTipoCompra, setEditTipoCompra] = useState<'CONTADO' | 'CREDITO'>('CONTADO');
    const [editMetodoPago, setEditMetodoPago] = useState('efectivo');
    const [editFacturaProveedor, setEditFacturaProveedor] = useState('');
    const [editCuotas, setEditCuotas] = useState<number>(1);
    const [editFechaVencimiento, setEditFechaVencimiento] = useState('');
    const [editCostosAdicionales, setEditCostosAdicionales] = useState<CostoAdicionalItem[]>([]);
    const [editInputValue, setEditInputValue] = useState('');
    const [editSearchResults, setEditSearchResults] = useState<Producto[]>([]);
    const [editShowSearchDropdown, setEditShowSearchDropdown] = useState(false);
    const [isSavingEditCompra, setIsSavingEditCompra] = useState(false);
    const [isLoadingEditDetails, setIsLoadingEditDetails] = useState(false);

    /* ── Edición de Compras (Administrador) ── */
    const editSubtotalLineas = useMemo(() => editLineas.reduce((sum, l) => sum + (Number(l.preciounitario || 0) * Number(l.cantidad || 0)), 0), [editLineas]);
    const editDescuentosLineas = useMemo(() => editLineas.reduce((sum, l) => sum + (Number(l.descuento) || 0), 0), [editLineas]);
    const editTotalProductos = Math.max(0, editSubtotalLineas - editDescuentosLineas);
    const editTotalCostosAdicionales = useMemo(() => editCostosAdicionales.reduce((sum, c) => sum + (parseFloat(c.monto) || 0), 0), [editCostosAdicionales]);
    const editTotalFactura = editTotalProductos + editTotalCostosAdicionales;

    const handleOpenEditModal = async (c: Compra) => {
        const compraId = c.id ?? c.compraid;
        if (!compraId) return;
        setIsLoadingEditDetails(true);
        setEditingCompra(c);
        setShowEditCompraModal(true);
        try {
            const [detallesRes, costosRes, cxpRes] = await Promise.all([
                api.get(`/compras-productos/compra/${compraId}`),
                api.get(`/costos-adicionales-compras?compraid=${compraId}&limit=0`).catch(() => ({ data: [] })),
                c.tipocompra === 'CREDITO' ? api.get(`/cuentas-por-pagar?limit=0`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
            ]);

            const rawDetalles = getArrayData(detallesRes.data, 'comprasProductos') || detallesRes.data || [];
            const loadedLineas: LineaCompra[] = rawDetalles.map((d: any) => {
                const pId = Number(d.productoid || d.producto?.id || d.productos?.productoid);
                const prodFromCat = productosCatalogo.find(p => Number(p.id) === pId);
                const nombre = d.productonombre || d.productos?.nombre || d.producto?.nombre || d.nombre || prodFromCat?.nombre || `Producto #${pId}`;
                const codigobarra = d.productocodigo || d.productos?.codigobarra || d.producto?.codigobarra || prodFromCat?.codigobarra || '';

                return {
                    producto: {
                        id: pId,
                        nombre: nombre,
                        codigobarra: codigobarra,
                        preciocompra: Number(d.preciounitario || d.productos?.preciocompra || prodFromCat?.preciocompra || 0),
                        precioventa: Number(d.productos?.precioventa || prodFromCat?.precioventa || 0),
                        stockactual: d.productos?.stockactual ?? prodFromCat?.stockactual,
                        stockminimo: d.productos?.stockminimo ?? prodFromCat?.stockminimo,
                    },
                    cantidad: Number(d.cantidad || 1),
                    preciounitario: Number(d.preciounitario || 0),
                    descuento: Number(d.descuento || 0),
                };
            });

            const rawCostos = getArrayData(costosRes.data, 'costosAdicionalesCompras') || costosRes.data || [];
            const loadedCostos: CostoAdicionalItem[] = rawCostos.map((ca: any) => ({
                id: String(ca.costoadicionalid || ca.id || Math.random()),
                concepto: ca.concepto || '',
                monto: String(ca.monto || ''),
            }));

            let loadedCuotas = 1;
            let loadedFechaVenc = '';
            if (c.tipocompra === 'CREDITO') {
                const cxpList = getArrayData(cxpRes.data, 'cuentasPorPagar') || cxpRes.data || [];
                const cxp = cxpList.find((x: any) => Number(x.compraid) === Number(compraId));
                if (cxp) {
                    loadedCuotas = cxp.cuotas || 1;
                    if (cxp.fechavencimiento) {
                        loadedFechaVenc = new Date(cxp.fechavencimiento).toISOString().split('T')[0];
                    }
                }
            }
            if (!loadedFechaVenc) {
                const d = new Date(); d.setDate(d.getDate() + 30);
                loadedFechaVenc = d.toISOString().split('T')[0];
            }

            setEditLineas(loadedLineas);
            setEditSelectedProveedor(String((c as any).proveedorid || (c as any).proveedores?.proveedorid || ''));
            setEditTipoCompra((c.tipocompra as any) || 'CONTADO');
            setEditMetodoPago(c.metodopago || 'efectivo');
            setEditFacturaProveedor(c.facturaproveedor || '');
            setEditCuotas(loadedCuotas);
            setEditFechaVencimiento(loadedFechaVenc);
            setEditCostosAdicionales(loadedCostos);
            setEditInputValue('');
            setEditSearchResults([]);
            setEditShowSearchDropdown(false);
        } catch (err: any) {
            Swal.fire('Error', 'No se pudieron cargar los detalles de la compra para edición.', 'error');
            setShowEditCompraModal(false);
        } finally {
            setIsLoadingEditDetails(false);
        }
    };

    const handleEditSearchChange = (val: string) => {
        setEditInputValue(val);
        const query = val.trim().toLowerCase();
        if (!query) {
            setEditSearchResults([]);
            setEditShowSearchDropdown(false);
            return;
        }
        const filtered = productosCatalogo.filter(p =>
            p.nombre.toLowerCase().includes(query) ||
            (p.codigobarra && p.codigobarra.toLowerCase().includes(query)) ||
            String(p.id).includes(query)
        ).slice(0, 15);
        setEditSearchResults(filtered);
        setEditShowSearchDropdown(filtered.length > 0);
    };

    const handleAddEditLinea = (prod: Producto) => {
        setEditLineas(prev => {
            const idx = prev.findIndex(l => Number(l.producto.id) === Number(prod.id));
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], cantidad: Number((Number(copy[idx].cantidad) + 1).toFixed(2)) };
                return copy;
            }
            return [...prev, {
                producto: prod,
                cantidad: 1,
                preciounitario: Number(prod.preciocompra || 0),
                descuento: 0,
            }];
        });
        setEditInputValue('');
        setEditSearchResults([]);
        setEditShowSearchDropdown(false);
    };

    const handleUpdateEditLinea = (idx: number, field: 'cantidad' | 'preciounitario' | 'descuento', val: any) => {
        setEditLineas(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], [field]: val };
            return copy;
        });
    };

    const handleRemoveEditLinea = (idx: number) => {
        setEditLineas(prev => prev.filter((_, i) => i !== idx));
    };

    const handleAddEditCostoAdicional = () => {
        setEditCostosAdicionales(prev => [...prev, { id: String(Date.now()), concepto: '', monto: '' }]);
    };

    const handleUpdateEditCostoAdicional = (id: string, field: 'concepto' | 'monto', val: string) => {
        setEditCostosAdicionales(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    };

    const handleRemoveEditCostoAdicional = (id: string) => {
        setEditCostosAdicionales(prev => prev.filter(c => c.id !== id));
    };

    const handleSaveEditCompra = async () => {
        if (!editingCompra) return;
        const compraId = editingCompra.id ?? editingCompra.compraid;
        if (editLineas.length === 0) {
            Swal.fire('Aviso', 'La compra debe contener al menos un producto.', 'warning');
            return;
        }
        if (!editSelectedProveedor) {
            Swal.fire('Aviso', 'Seleccione un proveedor.', 'warning');
            return;
        }

        for (let i = 0; i < editLineas.length; i++) {
            const l = editLineas[i];
            if (!l.cantidad || Number(l.cantidad) <= 0) {
                Swal.fire('Aviso', `La línea "${l.producto.nombre}" debe tener una cantidad mayor a 0.`, 'warning');
                return;
            }
            if (Number(l.preciounitario) < 0) {
                Swal.fire('Aviso', `La línea "${l.producto.nombre}" tiene un precio inválido.`, 'warning');
                return;
            }
        }

        setIsSavingEditCompra(true);
        try {
            const lineasPayload = editLineas.map(l => ({
                productoid: l.producto.id,
                cantidad: Number(l.cantidad),
                preciounitario: Number(l.preciounitario),
                descuento: Number(l.descuento || 0),
            }));

            const costosPayload = editCostosAdicionales
                .filter(ca => parseFloat(ca.monto) > 0 && ca.concepto.trim())
                .map(ca => ({
                    concepto: ca.concepto.trim(),
                    monto: parseFloat(ca.monto),
                }));

            await api.put(`/compras/${compraId}`, {
                proveedorid: Number(editSelectedProveedor),
                total: editTotalFactura,
                metodopago: editTipoCompra === 'CREDITO' ? 'credito' : editMetodoPago,
                tipocompra: editTipoCompra,
                facturaproveedor: editFacturaProveedor || null,
                lineas: lineasPayload,
                costosAdicionales: costosPayload,
                cuotas: editTipoCompra === 'CREDITO' ? (editCuotas > 0 ? editCuotas : 1) : undefined,
                fechavencimiento: editTipoCompra === 'CREDITO' ? editFechaVencimiento : undefined,
            });

            Swal.fire({
                icon: 'success',
                title: 'Compra actualizada con éxito',
                timer: 1500,
                showConfirmButton: false,
            });
            setShowEditCompraModal(false);
            setEditingCompra(null);

            // Refrescar compras, cuentas por pagar y catálogo
            fetchCompras();
            fetchCuentasPorPagar();
            fetchInitialData();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo actualizar la compra.', 'error');
        } finally {
            setIsSavingEditCompra(false);
        }
    };

    return {
        showEditCompraModal, setShowEditCompraModal, editingCompra, editLineas,
        editSelectedProveedor, setEditSelectedProveedor,
        editTipoCompra, setEditTipoCompra, editMetodoPago, setEditMetodoPago,
        editFacturaProveedor, setEditFacturaProveedor,
        editCuotas, setEditCuotas, editFechaVencimiento, setEditFechaVencimiento,
        editCostosAdicionales,
        editInputValue, editSearchResults, editShowSearchDropdown, setEditShowSearchDropdown,
        isSavingEditCompra, isLoadingEditDetails,
        editSubtotalLineas, editDescuentosLineas, editTotalCostosAdicionales, editTotalFactura,
        handleOpenEditModal, handleEditSearchChange, handleAddEditLinea, handleUpdateEditLinea, handleRemoveEditLinea,
        handleAddEditCostoAdicional, handleUpdateEditCostoAdicional, handleRemoveEditCostoAdicional,
        handleSaveEditCompra,
    };
}
