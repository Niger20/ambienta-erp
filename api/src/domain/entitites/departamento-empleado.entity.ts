export class DepartamentoEmpleadoEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): DepartamentoEmpleadoEntity {
        const id = object.id ?? object.departamentoid;
        const { nombre, descripcion } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'El nombre es obligatorio';

        return new DepartamentoEmpleadoEntity(
            Number(id),
            nombre,
            descripcion ?? null
        );
    }
}
