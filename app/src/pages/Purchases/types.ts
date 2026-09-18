export interface Proveedor {
    id?: number;
    proveedorid?: number;
    nombreempresa: string;
    asesorventas: string;
    telefono?: string;
    direccion?: string;
    clasificacion?: string;
}

export interface Producto {
    id: number;
    nombre: string;
    codigobarra?: string | null;
    preciocompra: number;
    precioventa: number;
    stockactual?: number | null;
    stockminimo?: number | null;
    categorianombre?: string | null;
}

export interface LineaCompra {
    producto: Producto;
    cantidad: number;
    preciounitario: number;
    descuento: number;
}

export interface Compra {
    id?: number;
    compraid?: number;
    total: number;
    tipocompra: string;
    metodopago: string;
    fecha: string;
    facturaproveedor?: string;
    proveedores?: { nombreempresa: string };
}

export interface Categoria {
    id: number;
    name?: string;
    nombre?: string;
}

export interface CuentaPorPagar {
    cuentapagarid?: number;
    id?: number;
    compraid: number;
    montototal: number;
    montopagado: number;
    montorestante: number;
    fechavencimiento: string;
    estado: string;
    cuotas?: number | null;
    montocuota?: number | null;
    compras?: { proveedores?: { nombreempresa: string } };
}

export interface Abono {
    pagoid?: number;
    abonoid?: number;
    id?: number;
    fecha: string;
    monto: number;
    metodopago: string;
}

export interface CostoAdicionalItem {
    id: string;
    concepto: string;
    monto: string;
}

export interface OrdenCompraProducto {
    id?: number;
    ordencompraproductoid?: number;
    ordencompraid?: number;
    productoid: number;
    cantidadordenada: number;
    preciounitario: number;
    productonombre?: string | null;
    productocodigo?: string | null;
    productos?: Producto | any;
    producto?: Producto | any;
}

export interface OrdenCompra {
    id?: number;
    ordencompraid?: number;
    proveedorid: number;
    fechaorden: string;
    fechaesperada?: string | null;
    estado: string;
    proveedornombre?: string | null;
    proveedores?: Proveedor;
    ordenescompraproductos?: OrdenCompraProducto[];
    productos?: OrdenCompraProducto[];
}

export type ActiveTab = 'new' | 'ordenes' | 'history' | 'suppliers' | 'cuentas' | 'proposals';
