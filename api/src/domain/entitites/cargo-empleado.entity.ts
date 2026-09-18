export class CargoEmpleadoEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly departamentoid?: number | null,
        public readonly descripcion?: string | null,
        public readonly salariominimoreferencial?: number | null,
        public readonly salariomaximoreferencial?: number | null,
        public readonly estado: boolean = true,
        public readonly departamentonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): CargoEmpleadoEntity {
        const id = object.id ?? object.cargoid;
        const nombre = object.nombre ?? object.nombrecargo;
        const {
            departamentoid,
            descripcion,
            salariominimoreferencial,
            salariomaximoreferencial,
            salariobase,
            estado
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'Nombre del cargo es obligatorio';

        const departamentonombre = object.departamentosempleados?.nombre ?? object.departamentonombre ?? null;

        return new CargoEmpleadoEntity(
            Number(id),
            nombre,
            departamentoid != null ? Number(departamentoid) : null,
            descripcion ?? null,
            salariominimoreferencial != null ? Number(salariominimoreferencial) : (salariobase != null ? Number(salariobase) : null),
            salariomaximoreferencial != null ? Number(salariomaximoreferencial) : null,
            estado !== undefined ? Boolean(estado) : true,
            departamentonombre
        );
    }
}
