const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUserDto {

    private constructor(
        public readonly nombreusuario: string,
        public readonly contrasenahash: string,
        public readonly nombre: string,
        public readonly correo: string,
    ) {}

    /**
     * DTO del registro PÚBLICO (self-signup). No acepta "rol": todo usuario que se
     * registra por su cuenta queda con el rol "invitado" (asignado en el use-case).
     */
    static create(props: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { nombreusuario, contrasenahash, contrasena, confirmarcontrasena, nombre, correo } = props;

        if (!nombreusuario) return ['El nombre de usuario es obligatorio', undefined];
        if (typeof nombreusuario !== 'string') return ['El nombre de usuario debe ser una cadena de texto', undefined];

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (!correo) return ['El correo es obligatorio', undefined];
        if (typeof correo !== 'string' || !EMAIL_REGEX.test(correo.trim())) return ['El correo no es válido', undefined];

        const passwordValue = contrasenahash ?? contrasena;
        if (!passwordValue) return ['La contrasena es obligatoria', undefined];
        if (typeof passwordValue !== 'string') return ['La contrasena debe ser una cadena de texto', undefined];
        const passwordError = RegisterUserDto.validatePassword(passwordValue);
        if (passwordError) return [passwordError, undefined];

        if (confirmarcontrasena != null && confirmarcontrasena !== passwordValue) {
            return ['La confirmación de contraseña no coincide', undefined];
        }

        return [undefined, new RegisterUserDto(nombreusuario, passwordValue, nombre, correo.trim().toLowerCase())];
    }

    static validatePassword(value: string): string | undefined {
        const trimmed = value.trim();
        if (trimmed.length < 8) return 'La contrasena debe tener al menos 8 caracteres';
        if (!/[A-Z]/.test(trimmed)) return 'La contrasena debe tener al menos una letra mayuscula';
        if (!/[a-z]/.test(trimmed)) return 'La contrasena debe tener al menos una letra minuscula';
        if (!/\d/.test(trimmed)) return 'La contrasena debe tener al menos un numero';
        if (!/[^A-Za-z0-9]/.test(trimmed)) return 'La contrasena debe tener al menos un caracter especial';
        return undefined;
    }

    withHashedPassword(contrasenahash: string): RegisterUserDto {
        return new RegisterUserDto(this.nombreusuario, contrasenahash, this.nombre, this.correo);
    }
}
