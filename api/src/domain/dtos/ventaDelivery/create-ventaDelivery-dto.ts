export class CreateVentaDeliveryDto {

    private constructor(
        public readonly ventaid: number,
        public readonly deliveryid: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateVentaDeliveryDto?] {
        const { ventaid, deliveryid } = props;

        if (ventaid == null) return ['El venta id es obligatorio', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['El venta id debe ser un numero entero valido', undefined];
        }

        if (deliveryid == null) return ['El delivery id es obligatorio', undefined];
        const parsedDeliveryId = Number(deliveryid);
        if (Number.isNaN(parsedDeliveryId) || !Number.isInteger(parsedDeliveryId)) {
            return ['El delivery id debe ser un numero entero valido', undefined];
        }

        return [undefined, new CreateVentaDeliveryDto(
            parsedVentaId,
            parsedDeliveryId,
        )];
    }
}
