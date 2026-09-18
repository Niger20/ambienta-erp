import { UserRole } from "../enums/user-role";

export class UserEntity {

    constructor(
        public readonly id: number,
        public readonly nombreusuario: string,
        public readonly contrasenahash: string,
        public readonly fecharegistro?: Date | null,
        public readonly rol?: UserRole | null,
    ) {}

    get isFechaRegistroAvailable() {
        return this.fecharegistro != null;
    }

    get isRolAvailable() {
        return !!this.rol;
    }

    public static fromObject(object: { [key: string]: any }): UserEntity {
        const id = object.id ?? object.usuarioid;
        const { nombreusuario, contrasenahash, fecharegistro, rol } = object;

        if (id == null) throw 'ID is required';
        if (!nombreusuario) throw 'NombreUsuario is required';
        if (!contrasenahash) throw 'ContrasenaHash is required';

        return new UserEntity(
            Number(id),
            nombreusuario,
            contrasenahash,
            fecharegistro ? new Date(fecharegistro) : null,
            UserEntity.parseRole(rol)
        );
    }

    private static parseRole(value: any): UserRole | null {
        if (typeof value !== 'string') return value ?? null;
        const normalized = value.trim().toLowerCase();
        if (normalized === UserRole.Administrador) return UserRole.Administrador;
        if (normalized === UserRole.Empleado) return UserRole.Empleado;
        if (normalized === UserRole.Invitado) return UserRole.Invitado;
        return null;
    }
}
