import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import type { LineaProducto, Cliente, PagoMixtoItem, DeliveryData } from './types';

interface CheckoutContext {
    lineas: LineaProducto[];
    sesionActiva: number | null;
    metodoPago: string;
    numeroTransferencia: string;
    pagosMixtos: PagoMixtoItem[];
    totalAsignadoMixto: number;
    trueTotal: number;
    total: number;
    subtotal: number;
    descuentoLineas: number;
    montoDescuentoFactura: number;
    tipoDescuentoFactura: 'FIXED' | 'PERCENT';
    descuentoFactura: string;
    clienteIdSeleccionado: number | null;
    clientes: Cliente[];
    setClientes: (fn: (prev: Cliente[]) => Cliente[]) => void;
    clienteSeleccionado: Cliente | undefined;
    lugarVenta: 'NORMAL' | 'DELIVERY';
    deliveryData: DeliveryData;
    deliveryCost: number;
    repartidores: any[];
    tipoFactura: 'FISCAL' | 'NO_FISCAL' | null;
    fechaVencimientoCredito: string;
    divisaPago: 'NIO' | 'USD';
    setError: (msg: string) => void;
    refreshSession: () => Promise<void>;
    clearAll: () => void;
}

export function useCheckout(ctx: CheckoutContext) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');

    const handleCobrar = async () => {
        const {
            lineas, sesionActiva, metodoPago, numeroTransferencia, pagosMixtos, totalAsignadoMixto,
            trueTotal, total, subtotal, descuentoLineas, montoDescuentoFactura, tipoDescuentoFactura,
            descuentoFactura, clienteIdSeleccionado, clientes, setClientes, clienteSeleccionado,
            lugarVenta, deliveryData, deliveryCost, repartidores, tipoFactura, fechaVencimientoCredito,
            divisaPago, setError, refreshSession, clearAll,
        } = ctx;

        if (lineas.length === 0) return;

        if (lineas.some(l => !l.cantidad || isNaN(parseFloat(String(l.cantidad))) || parseFloat(String(l.cantidad)) < 0.1)) {
            setError("Todas las líneas deben tener una cantidad válida (mínimo 0.1).");
            return;
        }

        if (!sesionActiva) {
            setError("No hay una sesión de caja activa. Aperture caja primero.");
            return;
        }

        if (['bac', 'lafise'].includes(metodoPago) && !numeroTransferencia.trim()) {
            setError("Debe ingresar el número de transferencia para pagos con banco.");
            return;
        }

        if (metodoPago === 'mixto') {
            if (totalAsignadoMixto < trueTotal) {
                setError(`El monto asignado en pagos (C$ ${totalAsignadoMixto.toFixed(2)}) no cubre el total de la venta (C$ ${trueTotal.toFixed(2)}).`);
                return;
            }
            const invalidBank = pagosMixtos.some(p => ['BAC', 'LAFISE'].includes(p.metodo) && (parseFloat(p.monto) || 0) > 0 && !p.referencia.trim());
            if (invalidBank) {
                setError("Debe ingresar el número de transferencia para los pagos con BAC o LAFISE.");
                return;
            }
        }

        if (metodoPago === 'credito' && !clienteIdSeleccionado) {
            setError("Las ventas al crédito requieren un cliente seleccionado.");
            return;
        }

        if (metodoPago === 'credito' && clienteIdSeleccionado) {
            const cliente = clientes.find(c => c.id === clienteIdSeleccionado);
            if (cliente) {
                const limite = Number(cliente.limitecredito) || 0;
                if (limite === 0) {
                    const { isConfirmed } = await Swal.fire({
                        title: 'Cliente sin crédito',
                        text: `${cliente.nombre} no tiene límite de crédito. ¿Habilitar crédito por C$ ${total.toFixed(2)}?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Habilitar',
                        cancelButtonText: 'Cancelar',
                    });
                    if (!isConfirmed) return;
                    await api.put(`/clientes/${clienteIdSeleccionado}`, { ...cliente, limitecredito: total });
                    setClientes(prev => prev.map(c => c.id === clienteIdSeleccionado ? { ...c, limitecredito: total } : c));
                } else if (total > limite) {
                    await api.put(`/clientes/${clienteIdSeleccionado}`, { ...cliente, limitecredito: total });
                    setClientes(prev => prev.map(c => c.id === clienteIdSeleccionado ? { ...c, limitecredito: total } : c));
                }
            }
        }

        if (lugarVenta === 'DELIVERY') {
            if (!deliveryData.repartidorId) {
                setError("Seleccione un repartidor para el delivery.");
                return;
            }
            if (!deliveryData.direccionEntrega.trim()) {
                setError("Ingrese la dirección de entrega.");
                return;
            }
            const costoNum = parseFloat(deliveryData.costoEnvio);
            if (isNaN(costoNum) || costoNum < 0) {
                setError("Ingrese el monto de costo de envío para el delivery.");
                return;
            }
        }

        setIsProcessing(true);
        setError('');

        try {
            const ventaTotal = trueTotal;

            const tipoventa = metodoPago === 'cotizacion' ? 'COTIZACION' : (metodoPago === 'credito' ? 'CREDITO' : 'CONTADO');
            const ventaPayload = {
                sesionid: sesionActiva,
                total: ventaTotal,
                descuentofactura: montoDescuentoFactura,
                tipoventa,
                lugarventa: lugarVenta,
                clienteid: clienteIdSeleccionado || null,
                tipofactura: metodoPago === 'cotizacion' ? null : tipoFactura,
            };

            const ventaRes = await api.post('/ventas', ventaPayload);
            const venta = ventaRes.data;
            const ventaId = venta.id ?? venta.ventaid;

            if (!ventaId) throw new Error("No se pudo obtener el ID de la venta creada");

            const promesasDetalle = lineas.map(linea => {
                const detallePayload = {
                    ventaid: ventaId,
                    productoid: linea.producto.id,
                    cantidad: Number(linea.cantidad),
                    preciounitario: linea.producto.precioventa,
                    descuento: Number(linea.descuento) || 0,
                };
                return api.post('/venta-productos', detallePayload);
            });

            await Promise.all(promesasDetalle);

            // Registrar ventapagos (excepto cotizaciones)
            if (metodoPago === 'mixto') {
                for (const pago of pagosMixtos) {
                    const pMonto = parseFloat(pago.monto) || 0;
                    if (pMonto > 0) {
                        const isBanco = ['BAC', 'LAFISE'].includes(pago.metodo);
                        await api.post('/venta-pagos', {
                            ventaid: ventaId,
                            metodopago: pago.metodo,
                            monto: pMonto,
                            banco: isBanco ? pago.metodo : (pago.metodo === 'TARJETA' ? 'TARJETA' : null),
                            numerotransferencia: isBanco ? (pago.referencia.trim() || 'N/A') : null,
                        });
                    }
                }
            } else if (metodoPago !== 'cotizacion') {
                const isBanco = ['bac', 'lafise'].includes(metodoPago);
                await api.post('/venta-pagos', {
                    ventaid: ventaId,
                    metodopago: metodoPago.toUpperCase(),
                    monto: ventaTotal,
                    banco: isBanco ? metodoPago.toUpperCase() : (metodoPago === 'tarjeta' ? 'TARJETA' : null),
                    numerotransferencia: isBanco ? numeroTransferencia.trim() : null,
                });
            }

            if (metodoPago === 'credito' && clienteIdSeleccionado) {
                await api.post('/cuentas-por-cobrar', {
                    ventaid: ventaId,
                    clienteid: clienteIdSeleccionado,
                    montototal: ventaTotal,
                    fechavencimiento: fechaVencimientoCredito,
                    estado: 'PENDIENTE',
                });
            }

            const docTitulo = venta.consecutivofiscal
                ? `FACTURA FISCAL #${venta.consecutivofiscal}`
                : venta.consecutivonofiscal
                    ? `FACTURA COMERCIAL #${venta.consecutivonofiscal}`
                    : `FACTURA COMERCIAL #${ventaId}`;

            if (lugarVenta === 'DELIVERY') {
                const deliveryPayload = {
                    repartidorid: Number(deliveryData.repartidorId),
                    direccionentrega: deliveryData.direccionEntrega,
                    costo: deliveryCost,
                    estado: true,
                    fecha: new Date().toISOString()
                };

                const deliveryRes = await api.post('/deliveries', deliveryPayload);
                const deliveryId = deliveryRes.data.id || deliveryRes.data.deliveryid;

                if (deliveryId) {
                    await api.post('/venta-delivery', {
                        ventaid: ventaId,
                        deliveryid: deliveryId
                    });
                }
            }

            let text = `*AMBIENTA POS - ${docTitulo}*\n`;
            text += `Fecha: ${new Date().toLocaleString('es-NI')}\n`;
            if (clienteSeleccionado) text += `Cliente: ${clienteSeleccionado.nombre}\n`;
            text += `--------------------------------\n`;

            lineas.forEach(l => {
                const cant = Number(l.cantidad) || 1;
                const itemSub = cant * l.producto.precioventa;
                text += `${cant}x ${l.producto.nombre} - C$ ${itemSub.toFixed(2)}`;
                if (l.descuento > 0) {
                    text += ` (Desc: -C$ ${Number(l.descuento).toFixed(2)})`;
                }
                text += `\n`;
            });
            text += `--------------------------------\n`;
            text += `Subtotal: C$ ${subtotal.toFixed(2)}\n`;

            if (descuentoLineas > 0) {
                text += `Desc. Productos: -C$ ${descuentoLineas.toFixed(2)}\n`;
            }
            if (montoDescuentoFactura > 0) {
                text += `Desc. Factura (${tipoDescuentoFactura === 'PERCENT' ? `${descuentoFactura}%` : 'C$'}): -C$ ${montoDescuentoFactura.toFixed(2)}\n`;
            }

            if (lugarVenta === 'DELIVERY') {
                text += `Delivery: C$ ${deliveryCost.toFixed(2)}\n`;
                text += `*TOTAL A PAGAR: C$ ${(total + deliveryCost).toFixed(2)}*\n\n`;
                text += `Cliente de Delivery: ${clienteSeleccionado ? clienteSeleccionado.nombre : 'Sin especificar'}\n`;
                text += `Dirección: ${deliveryData.direccionEntrega}\n`;

                const repartidorSeleccionado = repartidores.find(r => (r.id || r.repartidorid).toString() === deliveryData.repartidorId);
                if (repartidorSeleccionado) {
                    text += `\n🏍️ *Datos del Repartidor*\n`;
                    text += `Nombre: ${repartidorSeleccionado.nombre}\n`;
                    if (repartidorSeleccionado.telefono) {
                        text += `Teléfono: ${repartidorSeleccionado.telefono}\n`;
                    }
                }

                const pagaCon = Number(deliveryData.montoPagaCliente);
                if (pagaCon > 0) {
                    text += `\nPaga con: C$ ${pagaCon.toFixed(2)}\n`;
                    const vuelto = pagaCon - (total + deliveryCost);
                    text += `Su Vuelto: C$ ${Math.max(0, vuelto).toFixed(2)}\n`;
                }
            } else {
                text += `*TOTAL A PAGAR: C$ ${total.toFixed(2)}*\n`;
            }

            if (metodoPago === 'mixto') {
                text += `\n*Forma de Pago (Mixto):*\n`;
                pagosMixtos.filter(p => (parseFloat(p.monto) || 0) > 0).forEach(p => {
                    text += ` • ${p.metodo}: C$ ${Number(p.monto).toFixed(2)}${p.referencia ? ` (Ref: ${p.referencia})` : ''}\n`;
                });
            } else {
                text += `Método de Pago: ${metodoPago.toUpperCase()}\n`;
            }

            text += `\n¡Gracias por su compra en Ambienta POS!`;

            const encoded = encodeURIComponent(text);
            const phone = clienteSeleccionado?.telefono ? clienteSeleccionado.telefono.replace(/\D/g, '') : '';
            const link = `https://wa.me/${phone}?text=${encoded}`;

            setWhatsappMessage(text);
            setWhatsappLink(link);

            if (lugarVenta === 'DELIVERY') {
                setShowSuccessModal(true);
            } else {
                const docLabel = venta.consecutivofiscal
                    ? `Factura Fiscal ${venta.consecutivofiscal}`
                    : venta.consecutivonofiscal
                        ? `Factura Comercial ${venta.consecutivonofiscal}`
                        : `Factura Comercial #${ventaId}`;

                Swal.fire({
                    icon: 'success',
                    title: 'Venta registrada',
                    text: `${docLabel} procesada exitosamente.`,
                    timer: 2200,
                    showConfirmButton: false,
                });
            }

            if (metodoPago === 'efectivo' || divisaPago === 'USD' || metodoPago === 'mixto') {
                await refreshSession();
            }

            clearAll();

        } catch (err: any) {
            console.error("Error al registrar venta:", err);
            let errMsg = err.response?.data?.error || err.message;
            if (typeof errMsg === 'object') {
                errMsg = JSON.stringify(errMsg);
            }
            setError(errMsg || "Error al procesar la venta. Intente nuevamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    return { isProcessing, handleCobrar, showSuccessModal, setShowSuccessModal, whatsappMessage, whatsappLink };
}
