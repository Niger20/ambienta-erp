export class LoginUserDto {


    private constructor(
        public readonly nombreusuario: string,
        public readonly contrasena: string,
    ) {}

    static create(props: { [key: string]: any }): [string?, LoginUserDto?] {
        const { nombreusuario, contrasena, password, pswd } = props;

        if (!nombreusuario) return ['El nombre de usuario es obligatorio', undefined];
        if (typeof nombreusuario !== 'string') return ['El nombre de usuario debe ser una cadena de texto', undefined];

        const passwordValue = contrasena ?? password ?? pswd;
        if (!passwordValue) return ['La contrasena es obligatoria', undefined];
        if (typeof passwordValue !== 'string') return ['La contrasena debe ser una cadena de texto', undefined];

        return [undefined, new LoginUserDto(nombreusuario, passwordValue)];
    }
}