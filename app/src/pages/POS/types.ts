export interface Producto {
    id: number;
    nombre: string;
    codigobarra?: string | null;
    descripcion?: string | null;
    precioventa: number;
    preciocompra: number;
    stockactual?: number | null;
    categorianombre?: string | null;
    preciomayoreo?: number | null;
    cantidadminimamayoreo?: number | null;
}

export interface LineaProducto {
    producto: Producto;
    cantidad: number;
    descuento: number;
}

export interface PagoMixtoItem {
    id: string;
    metodo: 'EFECTIVO' | 'BAC' | 'LAFISE' | 'TARJETA';
    monto: string;
    referencia: string;
}

export interface Cliente {
    id: number;
    nombre: string;
    cedula?: string;
    telefono?: string;
    direccion?: string;
    limitecredito?: number | null;
}

export interface DeliveryData {
    repartidorId: string;
    direccionEntrega: string;
    costoEnvio: string;
    montoPagaCliente: string;
}

export interface SavedPOSState {
    lineas?: LineaProducto[];
    clienteIdSeleccionado?: number | null;
    metodoPago?: string;
    tipoFactura?: 'FISCAL' | 'NO_FISCAL' | null;
    lugarVenta?: 'NORMAL' | 'DELIVERY';
    divisaPago?: 'NIO' | 'USD';
    numeroTransferencia?: string;
    descuentoFactura?: string;
    tipoDescuentoFactura?: 'FIXED' | 'PERCENT';
    pagosMixtos?: PagoMixtoItem[];
    deliveryData?: Partial<DeliveryData>;
}

/** Se lee una sola vez al montar el componente — no es un hook, es una función pura. */
export function getSavedPOSState(): SavedPOSState | null {
    try {
        return JSON.parse(sessionStorage.getItem('pos_state') || 'null');
    } catch {
        return null;
    }
}
