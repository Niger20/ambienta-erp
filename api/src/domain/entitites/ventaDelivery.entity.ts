export class VentaDeliveryEntity {

    constructor(
        public readonly ventaid: number,
        public readonly deliveryid: number,
    ) { }

    public static fromObject(object: { [key: string]: any }): VentaDeliveryEntity {
        const { ventaid, deliveryid } = object;

        if (ventaid == null) throw 'Venta ID es obligatorio';
        if (deliveryid == null) throw 'Delivery ID es obligatorio';

        return new VentaDeliveryEntity(
            Number(ventaid),
            Number(deliveryid),
        );
    }
}
