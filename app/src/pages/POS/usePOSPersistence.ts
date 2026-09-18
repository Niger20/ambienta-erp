import { useEffect } from 'react';
import type { LineaProducto, PagoMixtoItem, DeliveryData } from './types';

export function usePOSPersistence(
    lineas: LineaProducto[],
    clienteIdSeleccionado: number | null,
    metodoPago: string,
    tipoFactura: 'FISCAL' | 'NO_FISCAL' | null,
    lugarVenta: 'NORMAL' | 'DELIVERY',
    divisaPago: 'NIO' | 'USD',
    numeroTransferencia: string,
    descuentoFactura: string,
    tipoDescuentoFactura: 'FIXED' | 'PERCENT',
    pagosMixtos: PagoMixtoItem[],
    deliveryData: DeliveryData,
) {
    useEffect(() => {
        if (lineas.length === 0 && !clienteIdSeleccionado && metodoPago === 'efectivo' && !descuentoFactura) {
            sessionStorage.removeItem('pos_state');
            return;
        }
        const state = { lineas, clienteIdSeleccionado, metodoPago, tipoFactura, lugarVenta, divisaPago, numeroTransferencia, descuentoFactura, tipoDescuentoFactura, pagosMixtos, deliveryData };
        sessionStorage.setItem('pos_state', JSON.stringify(state));
    }, [lineas, clienteIdSeleccionado, metodoPago, tipoFactura, lugarVenta, divisaPago, numeroTransferencia, descuentoFactura, tipoDescuentoFactura, pagosMixtos, deliveryData]);
}
