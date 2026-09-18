export class CreateUnidadMedidaDto {

    private constructor(
        public readonly nombre: string,
        public readonly abreviatura: string,
        public readonly permitefraccionamiento: boolean = false,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateUnidadMedidaDto?] {
        const { nombre, abreviatura, permitefraccionamiento } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (!abreviatura) return ['La abreviatura es obligatoria', undefined];
        if (typeof abreviatura !== 'string') return ['La abreviatura debe ser una cadena de texto', undefined];

        return [
            undefined,
            new CreateUnidadMedidaDto(
                nombre.trim(),
                abreviatura.trim().toUpperCase(),
                Boolean(permitefraccionamiento)
            )
        ];
    }
}
