export class CreateRolDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion?: string,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateRolDto?] {
        const { nombre, descripcion } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (descripcion != null && typeof descripcion !== 'string') return ['La descripcion debe ser una cadena de texto', undefined];

        return [undefined, new CreateRolDto(nombre.trim(), descripcion)];
    }
}
