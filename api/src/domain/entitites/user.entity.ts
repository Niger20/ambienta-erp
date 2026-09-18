import { UserRole } from "../enums/user-role";

export class UserEntity {

    constructor(
        public readonly id: number,
        public readonly nombreusuario: string,
        public readonly contrasenahash: string,
        public readonly fecharegistro?: Date | null,
        public readonly rol?: UserRole | string | null,
        public readonly rolid?: number | null,
        public readonly nombre?: string | null,
        public readonly apellido?: string | null,
        public readonly correo?: string | null,
        public readonly telefono?: string | null,
        public readonly fotoperfil?: string | null,
        public readonly correoverificado?: boolean,
    ) {}

    get isFechaRegistroAvailable() {
        return this.fecharegistro != null;
    }

    get isRolAvailable() {
        return !!this.rol;
    }

    public static fromObject(object: { [key: string]: any }): UserEntity {
        const id = object.id ?? object.usuarioid;
        const {
            nombreusuario, contrasenahash, fecharegistro, rol, rolid,
            nombre, apellido, correo, telefono, fotoperfil, correoverificado,
        } = object;

        if (id == null) throw 'ID is required';
        if (!nombreusuario) throw 'NombreUsuario is required';
        if (!contrasenahash) throw 'ContrasenaHash is required';

        return new UserEntity(
            Number(id),
            nombreusuario,
            contrasenahash,
            fecharegistro ? new Date(fecharegistro) : null,
            UserEntity.parseRole(rol),
            rolid ?? null,
            nombre ?? null,
            apellido ?? null,
            correo ?? null,
            telefono ?? null,
            fotoperfil ?? null,
            !!correoverificado,
        );
    }

    /**
     * Normaliza los 3 roles de sistema a su valor del enum; cualquier otro nombre
     * (un rol personalizado creado desde Roles y Permisos) se conserva tal cual,
     * en vez de descartarse — la autorización real usa `rolid`, esto es solo display.
     */
    private static parseRole(value: any): UserRole | string | null {
        if (typeof value !== 'string') return value ?? null;
        const normalized = value.trim().toLowerCase();
        if (normalized === UserRole.Administrador) return UserRole.Administrador;
        if (normalized === UserRole.Empleado) return UserRole.Empleado;
        if (normalized === UserRole.Invitado) return UserRole.Invitado;
        return normalized;
    }
}
