export interface Cliente {
    id: number;
    nombre: string;
    cedula?: string;
    telefono?: string;
    direccion?: string;
    limitecredito?: number | null;
    estado?: boolean;
}

export interface Venta {
    id: number;
    ventaid?: number;
    total: number;
    metodopago: string;
    tipoventa: string;
    lugarventa: string;
    fecha: string;
    estado?: boolean | string;
    tipofactura?: string | null;
    consecutivofiscal?: string | null;
    consecutivonofiscal?: string | null;
    descuentofactura?: number | null;
    clienteid?: number | null;
    clientenombre?: string | null;   // flat field from VentaEntity
    clientetelefono?: string | null; // flat field from VentaEntity
    clientes?: { nombre: string; telefono?: string }; // fallback if API includes join
}

export interface CuentaPorCobrar {
    id: number;
    cuentaid?: number;
    ventaid: number;
    clienteid: number;
    montototal: number;
    montopagado: number;
    montorestante: number;
    fechavencimiento: string;
    estado: string;
    clientes?: { nombre: string; telefono?: string };
    ventas?: { ventaid: number };
}

export interface Abono {
    abonoid: number;
    cuentaid: number;
    fecha: string;
    monto: number;
    metodopago: string;
}

export const getSaleClientName = (sale: Venta) =>
    sale.clientenombre || sale.clientes?.nombre || 'Público General';
