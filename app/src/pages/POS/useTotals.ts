import type { LineaProducto, PagoMixtoItem, DeliveryData } from './types';

export function useTotals(
    lineas: LineaProducto[],
    descuentoFactura: string,
    tipoDescuentoFactura: 'FIXED' | 'PERCENT',
    lugarVenta: 'NORMAL' | 'DELIVERY',
    deliveryData: DeliveryData,
    pagosMixtos: PagoMixtoItem[],
    montoRecibidoNIO: string,
    montoRecibidoUSD: string,
    tasaCambio: number,
) {
    const subtotal = lineas.reduce((sum, l) => sum + l.producto.precioventa * (Number(l.cantidad) || 0), 0);
    const descuentoLineas = lineas.reduce((sum, l) => sum + (Number(l.descuento) || 0), 0);
    const subtotalConDescuentos = Math.max(0, subtotal - descuentoLineas);

    const descFacturaNum = parseFloat(descuentoFactura) || 0;
    const montoDescuentoFactura = tipoDescuentoFactura === 'PERCENT'
        ? Math.min(subtotalConDescuentos, (subtotalConDescuentos * descFacturaNum) / 100)
        : Math.min(subtotalConDescuentos, descFacturaNum);

    const descuentoTotal = descuentoLineas + montoDescuentoFactura;
    const total = Math.max(0, subtotal - descuentoTotal);
    const totalItems = lineas.reduce((sum, l) => sum + (Number(l.cantidad) || 0), 0);
    const deliveryCost = lugarVenta === 'DELIVERY' ? (parseFloat(deliveryData.costoEnvio) || 0) : 0;
    const trueTotal = lugarVenta === 'DELIVERY' ? total + deliveryCost : total;

    /* ── Mixed payment calculations ── */
    const totalAsignadoMixto = pagosMixtos.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);
    const restanteMixto = Math.max(0, trueTotal - totalAsignadoMixto);
    const cambioMixto = Math.max(0, totalAsignadoMixto - trueTotal);

    /* ── NIO change calculations ── */
    const montoRecibidoNIONum = parseFloat(montoRecibidoNIO) || 0;
    const cambioNIO = montoRecibidoNIONum - trueTotal;

    /* ── Dollar calculations ── */
    const totalEnUSD = trueTotal / tasaCambio;
    const montoRecibidoUSDNum = parseFloat(montoRecibidoUSD) || 0;
    const equivalenteEnCordobas = montoRecibidoUSDNum * tasaCambio;
    const cambioEnCordobas = equivalenteEnCordobas - trueTotal;

    return {
        subtotal, descuentoLineas, subtotalConDescuentos, montoDescuentoFactura, descuentoTotal,
        total, totalItems, deliveryCost, trueTotal,
        totalAsignadoMixto, restanteMixto, cambioMixto,
        montoRecibidoNIONum, cambioNIO,
        totalEnUSD, montoRecibidoUSDNum, equivalenteEnCordobas, cambioEnCordobas,
    };
}
