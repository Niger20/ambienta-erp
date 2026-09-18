import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { ActiveTab, LineaCompra, OrdenCompra, Producto, Proveedor } from './types';

export function useOrdenesCompra(
    activeTab: ActiveTab,
    setActiveTab: (t: ActiveTab) => void,
    productosCatalogo: Producto[],
    proveedores: Proveedor[],
    setLineas: React.Dispatch<React.SetStateAction<LineaCompra[]>>,
    setSelectedProveedor: (v: string) => void,
    setOrdenCompraIdActiva: (v: number | null) => void,
) {
    const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(false);
    const [ordenSearchQuery, setOrdenSearchQuery] = useState('');
    const [ordenStatusFilter, setOrdenStatusFilter] = useState<'all' | 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA'>('all');
    const [selectedOrdenModal, setSelectedOrdenModal] = useState<OrdenCompra | null>(null);

    // Modal Crear Orden de Compra
    const [showCrearOrdenModal, setShowCrearOrdenModal] = useState(false);
    const [nuevaOrdenProveedorId, setNuevaOrdenProveedorId] = useState<string>('');
    const [nuevaOrdenFechaEsperada, setNuevaOrdenFechaEsperada] = useState<string>(() => {
        const d = new Date(); d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
    });
    const [nuevaOrdenLineas, setNuevaOrdenLineas] = useState<{ producto: Producto; cantidad: number; preciounitario: number }[]>([]);
    const [ordenInputSearch, setOrdenInputSearch] = useState('');
    const [ordenSearchResults, setOrdenSearchResults] = useState<Producto[]>([]);
    const [showOrdenSearchDropdown, setShowOrdenSearchDropdown] = useState(false);
    const [isSavingOrden, setIsSavingOrden] = useState(false);

    /* ── Órdenes de Compra Handlers ── */
    const fetchOrdenesCompra = async () => {
        setLoadingOrdenes(true);
        try {
            const [ordenesRes, productosRes] = await Promise.all([
                api.get('/ordenes-compra?limit=0'),
                api.get('/ordenes-compra-productos?limit=0').catch(() => ({ data: [] })),
            ]);

            const rawOrdenes: any[] = getArrayData(ordenesRes.data, 'ordenes');
            const allItems: any[] = getArrayData(productosRes.data, 'ordenesCompraProductos');

            const normalized: OrdenCompra[] = rawOrdenes.map(o => {
                const oId = Number(o.id ?? o.ordencompraid);

                let itemsList: any[] = [];
                if (Array.isArray(o.productos) && o.productos.length > 0) {
                    itemsList = o.productos;
                } else if (Array.isArray(o.ordenescompraproductos) && o.ordenescompraproductos.length > 0) {
                    itemsList = o.ordenescompraproductos;
                } else {
                    itemsList = allItems.filter((it: any) => Number(it.ordencompraid) === oId);
                }

                const mappedItems = itemsList.map((it: any) => {
                    const pId = Number(it.productoid || it.productos?.productoid || it.productos?.id || 0);
                    const prodInfo = it.productos || it.producto || productosCatalogo.find((p: Producto) => Number(p.id) === pId);
                    return {
                        ordencompraid: oId,
                        productoid: pId,
                        cantidadordenada: Number(it.cantidadordenada || 1),
                        preciounitario: Number(it.preciounitario ?? prodInfo?.preciocompra ?? 0),
                        productonombre: it.productonombre || prodInfo?.nombre || `Producto #${pId}`,
                        productocodigo: it.productocodigo || prodInfo?.codigobarra || '',
                        productos: prodInfo,
                    };
                });

                return {
                    ...o,
                    id: oId,
                    ordencompraid: oId,
                    proveedorid: Number(o.proveedorid),
                    productos: mappedItems,
                    ordenescompraproductos: mappedItems,
                };
            });

            setOrdenesCompra(normalized);
        } catch (err) {
            console.error('Error al cargar órdenes de compra:', err);
            setOrdenesCompra([]);
        } finally {
            setLoadingOrdenes(false);
        }
    };

    useEffect(() => { if (activeTab === 'ordenes') fetchOrdenesCompra(); }, [activeTab]);

    const handleCrearOrdenCompra = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevaOrdenProveedorId) { Swal.fire('Aviso', 'Seleccione un proveedor.', 'warning'); return; }
        if (nuevaOrdenLineas.length === 0) { Swal.fire('Aviso', 'Agregue al menos un producto a la orden.', 'warning'); return; }
        setIsSavingOrden(true);
        try {
            const res = await api.post('/ordenes-compra', {
                proveedorid: Number(nuevaOrdenProveedorId),
                fechaesperada: nuevaOrdenFechaEsperada || null,
                estado: 'PENDIENTE',
            });
            const orden = res.data;
            const ordenId = Number(orden.id ?? orden.ordencompraid);
            if (!ordenId || isNaN(ordenId)) {
                throw new Error('No se pudo obtener el ID de la orden creada.');
            }

            for (const l of nuevaOrdenLineas) {
                const prodId = Number(l.producto.id ?? (l.producto as any).productoid);
                const qty = Math.max(1, Number(l.cantidad) || 1);
                const price = Math.max(0, Number(l.preciounitario) || 0);
                await api.post('/ordenes-compra-productos', {
                    ordencompraid: ordenId,
                    productoid: prodId,
                    cantidadordenada: qty,
                    preciounitario: price,
                });
            }

            Swal.fire({ icon: 'success', title: `Orden #${ordenId} creada con éxito`, timer: 2000, showConfirmButton: false });
            setShowCrearOrdenModal(false);
            setNuevaOrdenProveedorId('');
            setNuevaOrdenLineas([]);
            setOrdenInputSearch('');
            await fetchOrdenesCompra();
        } catch (err: any) {
            console.error('Error al crear orden:', err);
            Swal.fire('Error', err.response?.data?.error || err.message || 'No se pudo crear la orden de compra.', 'error');
        } finally {
            setIsSavingOrden(false);
        }
    };

    const handleRecibirOrden = (orden: OrdenCompra) => {
        const items: any[] = (orden.productos && orden.productos.length > 0)
            ? orden.productos
            : (orden.ordenescompraproductos || []);

        if (items.length === 0) {
            Swal.fire('Aviso', 'La orden de compra no tiene productos asociados.', 'info');
            return;
        }

        const mapped: LineaCompra[] = items.map((it: any) => {
            const pId = Number(it.productoid || (it.productos as any)?.id || (it.productos as any)?.productoid || (it as any).id || 0);
            const pObj = (it.productos as any) || (it as any).producto || {};
            const localProd = productosCatalogo.find((p: Producto) => Number(p.id) === pId);

            return {
                producto: {
                    id: pId,
                    nombre: it.productonombre || pObj.nombre || localProd?.nombre || `Producto #${pId}`,
                    codigobarra: it.productocodigo || pObj.codigobarra || localProd?.codigobarra || '',
                    preciocompra: Number(it.preciounitario || pObj.preciocompra || localProd?.preciocompra || 0),
                    precioventa: Number(pObj.precioventa || localProd?.precioventa || 0),
                    stockactual: pObj.stockactual ?? localProd?.stockactual ?? null,
                },
                cantidad: Number(it.cantidadordenada) || 1,
                preciounitario: Number(it.preciounitario || pObj.preciocompra || localProd?.preciocompra || 0),
                descuento: 0,
            };
        });

        setLineas(mapped);
        setSelectedProveedor(String(orden.proveedorid));
        setOrdenCompraIdActiva(orden.id ?? orden.ordencompraid ?? null);
        setActiveTab('new');

        Swal.fire({
            icon: 'info',
            title: `Cargada Orden #${orden.id ?? orden.ordencompraid}`,
            text: `Se cargaron ${mapped.length} producto(s). Verifique cantidades recibidas físicamente y número de factura del proveedor.`,
            timer: 3000,
            showConfirmButton: false,
        });
    };

    const handleCancelarOrden = async (ordenId: number) => {
        const { isConfirmed } = await Swal.fire({
            title: `¿Cancelar Orden #${ordenId}?`,
            text: 'La orden cambiará de estado a CANCELADA.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar orden',
            cancelButtonText: 'Volver',
            confirmButtonColor: 'var(--accent-danger)',
        });
        if (!isConfirmed) return;
        try {
            await api.put(`/ordenes-compra/${ordenId}`, { estado: 'CANCELADA' });
            Swal.fire({ icon: 'success', title: 'Orden cancelada', timer: 1500, showConfirmButton: false });
            fetchOrdenesCompra();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo cancelar la orden.', 'error');
        }
    };

    const exportOrdenCompraPDF = (orden: OrdenCompra) => {
        const ordenId = orden.id ?? orden.ordencompraid;
        const prov = orden.proveedores || proveedores.find(p => Number(p.id ?? p.proveedorid) === Number(orden.proveedorid));
        const items: any[] = (orden.productos && orden.productos.length > 0)
            ? orden.productos
            : (orden.ordenescompraproductos || []);
        const totalEstimado = items.reduce((sum: number, it: any) => sum + (Number(it.cantidadordenada) || 0) * (Number(it.preciounitario) || 0), 0);

        const printWindow = window.open('', '_blank');
        if (!printWindow) { Swal.fire('Error', 'No se pudo abrir la ventana de impresión.', 'error'); return; }

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Orden de Compra #${ordenId}</title>
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
                }
                .title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #0f172a;
                    margin-top: 4px;
                }
                .meta {
                    text-align: right;
                }
                .meta-id {
                    font-weight: 700;
                    color: #4f46e5;
                    font-size: 16px;
                }
                .details-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 16px 20px;
                    margin-bottom: 24px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .details-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: #4f46e5;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                }
                .field-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    padding: 3px 0;
                }
                .field-row span { color: #64748b; }
                .field-row strong { color: #0f172a; }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 24px;
                }
                th {
                    font-size: 11px;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 10px 8px;
                    border-bottom: 2px solid #e2e8f0;
                    text-align: left;
                    font-weight: 600;
                    background: #f1f5f9;
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
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .totals-box {
                    width: 300px;
                    margin-left: auto;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 30px;
                }
                .totals-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .signatures {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-top: 60px;
                    padding-top: 20px;
                }
                .sig-box {
                    border-top: 1px solid #cbd5e1;
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                    padding-top: 8px;
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
                    <div class="title">ORDEN DE COMPRA</div>
                </div>
                <div class="meta">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b;">Consecutivo</div>
                    <div class="meta-id">ORDEN #${ordenId}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Estado: <strong>${orden.estado}</strong></div>
                </div>
            </div>

            <div class="details-card">
                <div>
                    <div class="details-title">Datos del Proveedor</div>
                    <div class="field-row"><span>Empresa:</span><strong>${prov?.nombreempresa || 'N/A'}</strong></div>
                    <div class="field-row"><span>Asesor:</span><strong>${prov?.asesorventas || '—'}</strong></div>
                    <div class="field-row"><span>Teléfono:</span><strong>${prov?.telefono || '—'}</strong></div>
                    <div class="field-row"><span>Dirección:</span><strong>${prov?.direccion || '—'}</strong></div>
                </div>
                <div>
                    <div class="details-title">Condiciones de la Orden</div>
                    <div class="field-row"><span>Fecha Emisión:</span><strong>${new Date(orden.fechaorden).toLocaleDateString('es-NI')}</strong></div>
                    <div class="field-row"><span>Fecha Entrega Esperada:</span><strong>${orden.fechaesperada ? new Date(orden.fechaesperada).toLocaleDateString('es-NI') : 'Inmediata / A convenir'}</strong></div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 40px;">#</th>
                        <th>Producto / Descripción</th>
                        <th class="text-center" style="width: 100px;">Cant. Solicitada</th>
                        <th class="text-right" style="width: 130px;">Costo Estimado</th>
                        <th class="text-right" style="width: 140px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((it: any, idx: number) => {
            const prodName = it.productonombre || it.productos?.nombre || (it as any)?.nombre || (it.producto?.nombre) || `Producto #${it.productoid}`;
            const prodCodigo = it.productocodigo || it.productos?.codigobarra || (it as any)?.codigobarra || (it.producto?.codigobarra) || '';
            const cant = Number(it.cantidadordenada) || 0;
            const precio = Number(it.preciounitario) || 0;
            const sub = cant * precio;
            return `
                            <tr>
                                <td>${idx + 1}</td>
                                <td><strong>${prodName}</strong>${prodCodigo ? `<div style="font-size: 11px; color: #64748b;">Cód: ${prodCodigo}</div>` : ''}</td>
                                <td class="tabular-nums text-center"><strong>${cant}</strong></td>
                                <td class="tabular-nums text-right">C$ ${precio.toFixed(2)}</td>
                                <td class="tabular-nums text-right" style="font-weight: 600; color: #0f172a;">C$ ${sub.toFixed(2)}</td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>

            <div class="totals-box">
                <div class="totals-row">
                    <span>Total Estimado de la Orden:</span>
                    <span class="tabular-nums">C$ ${totalEstimado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div class="signatures">
                <div class="sig-box">Autorizado por (Ambienta POS)</div>
                <div class="sig-box">Recibido / Conforme Proveedor</div>
            </div>

            <div class="report-footer">
                <span>Ambienta POS · Gestión de Órdenes de Compra</span>
                <span>Generado el ${new Date().toLocaleString('es-NI')}</span>
            </div>
        </body>
        </html>`;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
    };

    const filteredOrdenesCompra = useMemo(() => {
        const query = ordenSearchQuery.trim().toLowerCase();
        return ordenesCompra.filter(o => {
            const matchesStatus = ordenStatusFilter === 'all' || o.estado === ordenStatusFilter;
            if (!matchesStatus) return false;
            if (!query) return true;
            const provName = o.proveedores?.nombreempresa || proveedores.find(p => (p.id ?? p.proveedorid) === o.proveedorid)?.nombreempresa || '';
            return String(o.id ?? o.ordencompraid).includes(query) || provName.toLowerCase().includes(query);
        });
    }, [ordenesCompra, ordenStatusFilter, ordenSearchQuery, proveedores]);

    return {
        ordenesCompra, loadingOrdenes, ordenSearchQuery, setOrdenSearchQuery,
        ordenStatusFilter, setOrdenStatusFilter, selectedOrdenModal, setSelectedOrdenModal,
        showCrearOrdenModal, setShowCrearOrdenModal,
        nuevaOrdenProveedorId, setNuevaOrdenProveedorId,
        nuevaOrdenFechaEsperada, setNuevaOrdenFechaEsperada,
        nuevaOrdenLineas, setNuevaOrdenLineas,
        ordenInputSearch, setOrdenInputSearch,
        ordenSearchResults, setOrdenSearchResults,
        showOrdenSearchDropdown, setShowOrdenSearchDropdown,
        isSavingOrden,
        fetchOrdenesCompra, handleCrearOrdenCompra, handleRecibirOrden, handleCancelarOrden, exportOrdenCompraPDF,
        filteredOrdenesCompra,
    };
}
