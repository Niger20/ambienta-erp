export class DeliveryEntity {

    constructor(
        public readonly id: number,
        public readonly repartidorid: number,
        public readonly direccionentrega: string,
        public readonly costo: number,
        public readonly repartidornombre: string,
        public readonly repartidortelefono: string | null,
        public readonly fecha?: Date | null,
        public readonly estado?: boolean | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): DeliveryEntity {
        const id = object.id ?? object.deliveryid;
        const {
            repartidorid,
            direccionentrega,
            costo,
            fecha,
            estado,
        } = object;

        const repartidornombre =
            object.repartidornombre ??
            object.repartidores?.nombre ??
            object.repartidor?.nombre ??
            null;

        const repartidortelefono =
            object.repartidortelefono ??
            object.repartidores?.telefono ??
            object.repartidor?.telefono ??
            null;

        if (id == null) throw 'ID is required';
        if (repartidorid == null) throw 'Repartidor ID is required';
        if (!direccionentrega) throw 'Direccion de entrega is required';
        if (costo == null) throw 'Costo is required';
        if (!repartidornombre) throw 'Repartidor nombre is required';

        return new DeliveryEntity(
            Number(id),
            Number(repartidorid),
            direccionentrega,
            Number(costo),
            repartidornombre,
            repartidortelefono ?? null,
            fecha ? new Date(fecha) : null,
            estado ?? null,
        );
    }
}
