export class CreateCategoriaClienteDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion?: string | null,
        public readonly porcentajedescuento: number = 0,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateCategoriaClienteDto?] {
        const { nombre, descripcion, porcentajedescuento } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        let parsedDescuento = 0;
        if (porcentajedescuento != null) {
            const parsed = Number(porcentajedescuento);
            if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
                return ['El porcentaje de descuento debe ser un número entre 0 y 100', undefined];
            }
            parsedDescuento = parsed;
        }

        return [
            undefined,
            new CreateCategoriaClienteDto(
                nombre.trim(),
                descripcion ? String(descripcion).trim() : null,
                parsedDescuento
            )
        ];
    }
}
