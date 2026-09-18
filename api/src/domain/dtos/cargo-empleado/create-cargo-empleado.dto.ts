export class CreateCargoEmpleadoDto {

    private constructor(
        public readonly nombre: string,
        public readonly departamentoid?: number | null,
        public readonly descripcion?: string | null,
        public readonly salariominimoreferencial?: number | null,
        public readonly salariomaximoreferencial?: number | null,
        public readonly estado: boolean = true,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateCargoEmpleadoDto?] {
        const nombre = props.nombre ?? props.nombrecargo;
        const {
            departamentoid,
            descripcion,
            salariominimoreferencial,
            salariomaximoreferencial,
            salariobase,
            estado
        } = props;

        if (!nombre) return ['El nombre del cargo es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre del cargo debe ser una cadena de texto', undefined];

        let parsedDeptoId: number | null = null;
        if (departamentoid != null) {
            const parsed = Number(departamentoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El departamento ID debe ser un número entero válido', undefined];
            }
            parsedDeptoId = parsed;
        }

        const min = salariominimoreferencial != null ? Number(salariominimoreferencial) : (salariobase != null ? Number(salariobase) : null);
        const max = salariomaximoreferencial != null ? Number(salariomaximoreferencial) : null;

        return [
            undefined,
            new CreateCargoEmpleadoDto(
                nombre.trim(),
                parsedDeptoId,
                descripcion ? String(descripcion).trim() : null,
                min,
                max,
                estado !== undefined ? Boolean(estado) : true
            )
        ];
    }
}
