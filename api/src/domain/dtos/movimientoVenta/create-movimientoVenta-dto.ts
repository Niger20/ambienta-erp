export class CreateMovimientoVentaDto {

    private constructor(
        public readonly movimeintoventaid: number,
        public readonly ventaid: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateMovimientoVentaDto?] {
        const { movimeintoventaid, ventaid } = props;

        if (movimeintoventaid == null) return ['El movimiento venta id es obligatorio', undefined];
        const parsedMovimientoId = Number(movimeintoventaid);
        if (Number.isNaN(parsedMovimientoId) || !Number.isInteger(parsedMovimientoId)) {
            return ['El movimiento venta id debe ser un numero entero valido', undefined];
        }

        if (ventaid == null) return ['El venta id es obligatorio', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['El venta id debe ser un numero entero valido', undefined];
        }

        return [undefined, new CreateMovimientoVentaDto(
            parsedMovimientoId,
            parsedVentaId,
        )];
    }
}
