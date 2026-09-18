export class UpdateCargoEmpleadoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly departamentoid?: number | null,
        public readonly descripcion?: string | null,
        public readonly salariominimoreferencial?: number | null,
        public readonly salariomaximoreferencial?: number | null,
        public readonly estado?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.departamentoid !== undefined) returnObj.departamentoid = this.departamentoid;
        if (this.descripcion !== undefined) returnObj.descripcion = this.descripcion;
        if (this.salariominimoreferencial !== undefined) returnObj.salariominimoreferencial = this.salariominimoreferencial;
        if (this.salariomaximoreferencial !== undefined) returnObj.salariomaximoreferencial = this.salariomaximoreferencial;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCargoEmpleadoDto?] {
        const {
            id,
            departamentoid,
            descripcion,
            salariominimoreferencial,
            salariomaximoreferencial,
            salariobase,
            estado
        } = props;
        const nombre = props.nombre ?? props.nombrecargo;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedDeptoId: number | null | undefined;
        if (departamentoid !== undefined) {
            if (departamentoid === null) {
                parsedDeptoId = null;
            } else {
                const parsed = Number(departamentoid);
                if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return ['El departamento ID debe ser un entero válido', undefined];
                parsedDeptoId = parsed;
            }
        }

        const min = salariominimoreferencial !== undefined ? (salariominimoreferencial != null ? Number(salariominimoreferencial) : null) : (salariobase !== undefined ? (salariobase != null ? Number(salariobase) : null) : undefined);
        const max = salariomaximoreferencial !== undefined ? (salariomaximoreferencial != null ? Number(salariomaximoreferencial) : null) : undefined;

        return [
            undefined,
            new UpdateCargoEmpleadoDto(
                parsedId,
                nombre ? String(nombre).trim() : undefined,
                parsedDeptoId,
                descripcion !== undefined ? (descripcion ? String(descripcion).trim() : null) : undefined,
                min,
                max,
                estado !== undefined ? Boolean(estado) : undefined
            )
        ];
    }
}
