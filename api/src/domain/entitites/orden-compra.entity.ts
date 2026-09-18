export class OrdenCompraEntity {

    constructor(
        public readonly id: number,
        public readonly proveedorid: number,
        public readonly estado: string = 'PENDIENTE',
        public readonly fechaorden?: Date | null,
        public readonly fechaesperada?: Date | null,
        public readonly proveedornombre?: string | null,
        public readonly productos?: any[],
    ) {}

    public static fromObject(object: { [key: string]: any }): OrdenCompraEntity {
        const id = object.id ?? object.ordencompraid;
        const { proveedorid, estado, fechaorden, fechaesperada, ordenescompraproductos } = object;

        if (id == null) throw 'ID es obligatorio';
        if (proveedorid == null) throw 'Proveedor ID es obligatorio';

        const proveedornombre = object.proveedores?.nombreempresa ?? object.proveedornombre ?? null;

        return new OrdenCompraEntity(
            Number(id),
            Number(proveedorid),
            estado || 'PENDIENTE',
            fechaorden ? new Date(fechaorden) : null,
            fechaesperada ? new Date(fechaesperada) : null,
            proveedornombre,
            ordenescompraproductos ?? []
        );
    }
}
