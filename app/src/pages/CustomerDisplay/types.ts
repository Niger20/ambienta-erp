export interface Producto {
    id: number;
    nombre: string;
    codigobarra?: string | null;
    precioventa: number;
    categorianombre?: string | null;
}

export interface LineaProducto {
    producto: Producto;
    cantidad: number;
    descuento: number;
}

export interface POSData {
    lineas: LineaProducto[];
    subtotal: number;
    descuentoTotal: number;
    total: number;
    totalItems: number;
    montoRecibido?: number;
    cambio?: number;
}
