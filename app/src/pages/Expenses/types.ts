export interface Gasto {
    gastoid: number;
    nombre: string;
    descripcion?: string;
    usuarioid: number;
    totalPagado?: number;
}

export interface PagoData {
    pagoid?: number;
    fecha?: string;
    monto?: number;
    metodopago?: string;
    estado?: boolean;
}

export interface PagoGasto {
    pagoid: number;
    gastoid: number;
    pago?: PagoData;   // entity-mapped key
    pagos?: PagoData;  // Prisma raw relation key (fallback)
}

// Helper: resolve pago data regardless of key name
export const getPago = (pg: PagoGasto): PagoData => pg.pago ?? pg.pagos ?? {};

export const METODOS_PAGO = ['efectivo', 'bac', 'lafise', 'banpro', 'transferencia'];
