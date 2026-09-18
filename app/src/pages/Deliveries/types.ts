export interface Repartidor {
    id?: number;
    repartidorid?: number;
    nombre: string;
    telefono: string;
}

export interface Delivery {
    id: number;
    repartidorid: number;
    direccionentrega: string;
    costo: number;
    estado: boolean;
    repartidornombre: string;
    repartidortelefono: string | null;
    fecha?: string;
}

export type ActiveTab = 'deliveries' | 'repartidores' | 'resumen';
