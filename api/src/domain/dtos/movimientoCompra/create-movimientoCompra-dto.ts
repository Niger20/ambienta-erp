export class CreateMovimientoCompraDto {

    private constructor(
        public readonly movimientocompraid: number,
        public readonly compraid: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateMovimientoCompraDto?] {
        const { movimientocompraid, compraid } = props;

        if (movimientocompraid == null) return ['El movimiento compra id es obligatorio', undefined];
        const parsedMovimientoId = Number(movimientocompraid);
        if (Number.isNaN(parsedMovimientoId) || !Number.isInteger(parsedMovimientoId)) {
            return ['El movimiento compra id debe ser un numero entero valido', undefined];
        }

        if (compraid == null) return ['El compra id es obligatorio', undefined];
        const parsedCompraId = Number(compraid);
        if (Number.isNaN(parsedCompraId) || !Number.isInteger(parsedCompraId)) {
            return ['El compra id debe ser un numero entero valido', undefined];
        }

        return [undefined, new CreateMovimientoCompraDto(
            parsedMovimientoId,
            parsedCompraId,
        )];
    }
}
