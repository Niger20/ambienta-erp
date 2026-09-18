export class CreateDepartamentoEmpleadoDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateDepartamentoEmpleadoDto?] {
        const { nombre, descripcion } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        return [
            undefined,
            new CreateDepartamentoEmpleadoDto(
                nombre.trim(),
                descripcion ? String(descripcion).trim() : null
            )
        ];
    }
}
