export class CreateGastoDto {

    private constructor(
        public readonly nombre: string,
        public readonly usuarioid: number,
        public readonly descripcion?: string | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateGastoDto?] {
        const { nombre, usuarioid, descripcion } = props;

        if (usuarioid == null) return ['El usuario id es obligatorio', undefined];
        const parsedUsuarioId = Number(usuarioid);
        if (Number.isNaN(parsedUsuarioId) || !Number.isInteger(parsedUsuarioId)) {
            return ['El usuario id debe ser un numero entero valido', undefined];
        }

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (descripcion != null && typeof descripcion !== 'string') {
            return ['La descripcion debe ser una cadena de texto', undefined];
        }

        return [undefined, new CreateGastoDto(
            nombre,
            parsedUsuarioId,
            descripcion ?? null,
        )];
    }
}
