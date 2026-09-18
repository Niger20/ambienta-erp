export interface Rol {
    id: number;
    nombre: string;
    descripcion: string | null;
    essistema: boolean;
    permisos: string[];
}

export interface Permiso {
    id: number;
    codigo: string;
    modulo: string;
    descripcion: string | null;
}

export interface RolForm {
    id: number | undefined;
    nombre: string;
    descripcion: string;
    permisoIds: number[];
}
