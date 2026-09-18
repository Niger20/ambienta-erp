import { UserRole } from "../../enums/user-role";

export class UpdateUserDto {

    private constructor(
        public readonly id: number,
        public readonly nombreusuario?: string,
        public readonly contrasenahash?: string,
        public readonly rol?: UserRole | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombreusuario != null) returnObj.nombreusuario = this.nombreusuario;
        if (this.contrasenahash != null) returnObj.contrasenahash = this.contrasenahash;
        if (this.rol != null) returnObj.rol = this.rol;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { nombreusuario, contrasenahash, contrasena, rol } = props;

        if (nombreusuario != null && typeof nombreusuario !== 'string') {
            return ['El nombre de usuario debe ser una cadena de texto', undefined];
        }

        const passwordValue = contrasenahash ?? contrasena;
        if (passwordValue != null) {
            if (typeof passwordValue !== 'string') return ['La contrasena debe ser una cadena de texto', undefined];
            const passwordError = UpdateUserDto.validatePassword(passwordValue);
            if (passwordError) return [passwordError, undefined];
        }

        let parsedRol: UserRole | null | undefined;
        if (rol != null) {
            const [rolError, value] = UpdateUserDto.parseRol(rol);
            if (rolError) return [rolError, undefined];
            parsedRol = value;
        }

        return [
            undefined,
            new UpdateUserDto(
                parsedId,
                nombreusuario,
                passwordValue,
                parsedRol ?? null
            ),
        ];
    }

    private static parseRol(value: any): [string?, UserRole?] {
        if (typeof value !== 'string') return ['El rol debe ser una cadena de texto', undefined];
        const normalized = value.trim().toLowerCase();
        if (normalized === 'administrador') return [undefined, UserRole.Administrador];
        if (normalized === 'empleado') return [undefined, UserRole.Empleado];
        if (normalized === 'invitado') return [undefined, UserRole.Invitado];
        return ['El rol no es valido', undefined];
    }

    private static validatePassword(value: string): string | undefined {
        const trimmed = value.trim();
        if (trimmed.length < 8) return 'La contrasena debe tener al menos 8 caracteres';
        if (!/[A-Z]/.test(trimmed)) return 'La contrasena debe tener al menos una letra mayuscula';
        if (!/[a-z]/.test(trimmed)) return 'La contrasena debe tener al menos una letra minuscula';
        if (!/\d/.test(trimmed)) return 'La contrasena debe tener al menos un numero';
        if (!/[^A-Za-z0-9]/.test(trimmed)) return 'La contrasena debe tener al menos un caracter especial';
        return undefined;
    }

    withHashedPassword(contrasenahash: string): UpdateUserDto {
        return new UpdateUserDto(
            this.id,
            this.nombreusuario,
            contrasenahash,
            this.rol ?? null
        );
    }
}
