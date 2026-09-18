export class CategoriaClienteEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion?: string | null,
        public readonly porcentajedescuento: number = 0,
    ) {}

    public static fromObject(object: { [key: string]: any }): CategoriaClienteEntity {
        const id = object.id ?? object.categoriaclienteid;
        const { nombre, descripcion, porcentajedescuento } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'El nombre es obligatorio';

        return new CategoriaClienteEntity(
            Number(id),
            nombre,
            descripcion ?? null,
            porcentajedescuento != null ? Number(porcentajedescuento) : 0
        );
    }
}
