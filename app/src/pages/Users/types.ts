export interface User {
    usuarioid?: number;
    id?: number;
    nombreusuario: string;
    rol: string;
}

export const ROLES = ['administrador', 'empleado', 'invitado'];
