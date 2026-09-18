export class CreateFeriadoNacionalDto {

    private constructor(
        public readonly nombre: string,
        public readonly fecha: Date,
        public readonly esrecurrente: boolean = true,
        public readonly activo: boolean = true,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateFeriadoNacionalDto?] {
        const nombre = props.nombre ?? props.descripcion;
        const { fecha, esrecurrente, activo } = props;

        if (!nombre || typeof nombre !== 'string') return ['El nombre del feriado es obligatorio', undefined];

        if (!fecha) return ['La fecha es obligatoria', undefined];
        const parsedFecha = new Date(fecha);
        if (isNaN(parsedFecha.getTime())) return ['La fecha es inválida', undefined];

        return [
            undefined,
            new CreateFeriadoNacionalDto(
                nombre.trim(),
                parsedFecha,
                esrecurrente !== undefined ? Boolean(esrecurrente) : true,
                activo !== undefined ? Boolean(activo) : true
            )
        ];
    }
}
