export interface Category {
    id: number;
    name: string;
    description?: string;
    products?: any[]; // optional, if backend include it
}

export interface Product {
    id: number;
    nombre: string;
    precioventa: number;
    categorianombre: string;
    stockminimo: number;
    stockactual: number;
    utilidad: number;
    preciocompra?: number;
    codigobarra?: string;
    categoriaid?: number;
    descripcion?: string;
    unidadmedidaid?: number;
    preciomayoreo?: number;
    cantidadminimamayoreo?: number;
    requierefechavencimiento?: boolean;
    fechavencimiento?: string;
    publicadoencatalogo?: boolean;
}

export interface Movimiento {
    movimientoid: number;
    productoid: number;
    tipomovimiento: string;
    cantidad: number;
    fecha: string;
    motivo?: string;
    stockanterior: number;
    stockresultante?: number;
    productos?: { nombre: string };
    ventaid?: number | null;
    compraid?: number | null;
}

export interface Merma {
    id: number;
    productoid: number;
    cantidad: number;
    costounitario: number;
    costoperdida: number;
    motivo: string;
    usuarioid: number;
    fecha: string;
    productonombre?: string | null;
    usuarionombre?: string | null;
    productodestinoid?: number | null;
    cantidaddestino?: number | null;
    productodestinonombre?: string | null;
}

export interface PendingProduct {
    nombre: string;
    preciocompra: number;
    precioventa: number;
    codigobarra?: string;
    stockactual: number;
    stockminimo: number;
    descripcion: string;
    categoriaid?: number;
}

/* ─────────── Barcode Generator Helper ─────────── */
export const generateEAN13 = (): string => {
    const prefix = '200';
    const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString();
    const base12 = prefix + randomPart;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(base12[i], 10);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return base12 + checksum.toString();
};
