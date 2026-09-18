import { UserRole } from "../../enums/user-role";
import { RegisterUserDto } from "./register-user-dto";

/**
 * DTO de creación de usuario POR UN ADMINISTRADOR (permite fijar el rol explícitamente).
 * Distinto del registro público (`RegisterUserDto`), que siempre fuerza rol "invitado".
 *
 * Acepta `rolid` (id de un rol de la tabla `roles`, incluyendo roles personalizados creados
 * desde la pantalla de Roles y Permisos) o, para compatibilidad, `rol` (uno de los 3 roles
 * de sistema). Si ambos vienen, `rolid` tiene prioridad.
 */
export class AdminRegisterUserDto {

    private constructor(
        public readonly nombreusuario: string,
        public readonly contrasenahash: string,
        public readonly rol: UserRole | null,
        public readonly rolid: number | null,
        public readonly nombre?: string,
        public readonly correo?: string,
    ) {}

    static create(props: { [key: string]: any }): [string?, AdminRegisterUserDto?] {
        const { nombreusuario, contrasenahash, contrasena, rol, rolid, nombre, correo } = props;

        if (!nombreusuario) return ['El nombre de usuario es obligatorio', undefined];
        if (typeof nombreusuario !== 'string') return ['El nombre de usuario debe ser una cadena de texto', undefined];

        const passwordValue = contrasenahash ?? contrasena;
        if (!passwordValue) return ['La contrasena es obligatoria', undefined];
        if (typeof passwordValue !== 'string') return ['La contrasena debe ser una cadena de texto', undefined];
        const passwordError = RegisterUserDto.validatePassword(passwordValue);
        if (passwordError) return [passwordError, undefined];

        let parsedRol: UserRole | null = null;
        if (rol != null) {
            const [rolError, value] = AdminRegisterUserDto.parseRol(rol);
            if (rolError) return [rolError, undefined];
            parsedRol = value ?? null;
        }

        let parsedRolId: number | null = null;
        if (rolid != null) {
            const value = Number(rolid);
            if (Number.isNaN(value)) return ['El rolid debe ser un numero', undefined];
            parsedRolId = value;
        }

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (correo != null && typeof correo !== 'string') return ['El correo debe ser una cadena de texto', undefined];

        return [undefined, new AdminRegisterUserDto(nombreusuario, passwordValue, parsedRol, parsedRolId, nombre, correo)];
    }

    withHashedPassword(contrasenahash: string): AdminRegisterUserDto {
        return new AdminRegisterUserDto(this.nombreusuario, contrasenahash, this.rol, this.rolid, this.nombre, this.correo);
    }

    private static parseRol(value: any): [string?, UserRole?] {
        if (typeof value !== 'string') return ['El rol debe ser una cadena de texto', undefined];
        const normalized = value.trim().toLowerCase();
        if (normalized === 'administrador') return [undefined, UserRole.Administrador];
        if (normalized === 'empleado') return [undefined, UserRole.Empleado];
        if (normalized === 'invitado') return [undefined, UserRole.Invitado];
        return ['El rol no es valido', undefined];
    }
}
