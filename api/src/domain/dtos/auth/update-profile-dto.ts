import { RegisterUserDto } from "./register-user-dto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UpdateProfileDto {

    private constructor(
        public readonly usuarioid: number,
        public readonly nombre?: string,
        public readonly apellido?: string,
        public readonly telefono?: string,
        public readonly correo?: string,
        public readonly fotoperfil?: string,
        public readonly contrasenaActual?: string,
        public readonly contrasenaNueva?: string,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.apellido != null) returnObj.apellido = this.apellido;
        if (this.telefono != null) returnObj.telefono = this.telefono;
        if (this.correo != null) returnObj.correo = this.correo;
        if (this.fotoperfil != null) returnObj.fotoperfil = this.fotoperfil;
        return returnObj;
    }

    get wantsPasswordChange() {
        return !!this.contrasenaNueva;
    }

    static create(props: { [key: string]: any }): [string?, UpdateProfileDto?] {
        const { usuarioid } = props;
        const parsedId = Number(usuarioid);
        if (usuarioid == null || Number.isNaN(parsedId)) return ['El id de usuario es obligatorio', undefined];

        const { nombre, apellido, telefono, correo, fotoperfil, contrasenaActual, contrasenaNueva } = props;

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (apellido != null && typeof apellido !== 'string') return ['El apellido debe ser una cadena de texto', undefined];
        if (telefono != null && typeof telefono !== 'string') return ['El teléfono debe ser una cadena de texto', undefined];
        if (fotoperfil != null && typeof fotoperfil !== 'string') return ['La foto de perfil debe ser una URL/texto', undefined];

        if (correo != null) {
            if (typeof correo !== 'string' || !EMAIL_REGEX.test(correo.trim())) return ['El correo no es válido', undefined];
        }

        if (contrasenaNueva != null) {
            if (!contrasenaActual) return ['Debes indicar tu contraseña actual para cambiarla', undefined];
            const passwordError = RegisterUserDto.validatePassword(contrasenaNueva);
            if (passwordError) return [passwordError, undefined];
        }

        return [
            undefined,
            new UpdateProfileDto(
                parsedId,
                nombre,
                apellido,
                telefono,
                correo ? correo.trim().toLowerCase() : undefined,
                fotoperfil,
                contrasenaActual,
                contrasenaNueva,
            ),
        ];
    }
}
