export interface User {
    usuarioid?: number;
    id?: number;
    nombreusuario: string;
    rol: string;
    rolid?: number | null;
}

export interface RolOption {
    id: number;
    nombre: string;
}
