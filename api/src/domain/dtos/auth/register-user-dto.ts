import { UserRole } from "../../enums/user-role";


export class RegisterUserDto {


    private constructor(
        public readonly nombreusuario: string,
        public readonly contrasenahash: string,
        public readonly rol?: UserRole | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { nombreusuario, contrasenahash, contrasena, rol } = props;

        if (!nombreusuario) return ['El nombre de usuario es obligatorio', undefined];
        if (typeof nombreusuario !== 'string') return ['El nombre de usuario debe ser una cadena de texto', undefined];

        const passwordValue = contrasenahash ?? contrasena;
        if (!passwordValue) return ['La contrasena es obligatoria', undefined];
        if (typeof passwordValue !== 'string') return ['La contrasena debe ser una cadena de texto', undefined];
        const passwordError = RegisterUserDto.validatePassword(passwordValue);
        if (passwordError) return [passwordError, undefined];

        let parsedRol: UserRole | null | undefined;
        if (rol != null) {
            const [rolError, value] = RegisterUserDto.parseRol(rol);
            if (rolError) return [rolError, undefined];
            parsedRol = value;
        }

        return [undefined, new RegisterUserDto(nombreusuario, passwordValue, parsedRol ?? null)];
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

    withHashedPassword(contrasenahash: string): RegisterUserDto {
        return new RegisterUserDto(
            this.nombreusuario,
            contrasenahash,
            this.rol ?? null
        );
    }
}