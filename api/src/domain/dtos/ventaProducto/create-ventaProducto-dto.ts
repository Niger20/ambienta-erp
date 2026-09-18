export class CreateVentaProductoDto {

    private constructor(
        public readonly ventaid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly preciounitario?: number,
        public readonly descuento?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateVentaProductoDto?] {
        const { ventaid, productoid, cantidad, preciounitario, descuento } = props;

        if (ventaid == null) return ['El venta id es obligatorio', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['El venta id debe ser un numero entero valido', undefined];
        }

        if (productoid == null) return ['El producto id es obligatorio', undefined];
        const parsedProductoId = Number(productoid);
        if (Number.isNaN(parsedProductoId) || !Number.isInteger(parsedProductoId)) {
            return ['El producto id debe ser un numero entero valido', undefined];
        }

        if (cantidad == null) return ['La cantidad es obligatoria', undefined];
        const parsedCantidad = Number(cantidad);
        if (Number.isNaN(parsedCantidad) || parsedCantidad <= 0) {
            return ['La cantidad debe ser un numero positivo', undefined];
        }

        let parsedPrecioUnitario: number | undefined;
        if (preciounitario != null) {
            parsedPrecioUnitario = CreateVentaProductoDto.parseDecimalValue(preciounitario, 'precio unitario');
        }

        let parsedDescuento: number | undefined;
        if (descuento != null) {
            parsedDescuento = CreateVentaProductoDto.parseDecimalValue(descuento, 'descuento');
            if (parsedDescuento < 0 || parsedDescuento > 100) {
                return ['El descuento debe estar entre 0 y 100', undefined];
            }
        }

        return [undefined, new CreateVentaProductoDto(
            parsedVentaId,
            parsedProductoId,
            parsedCantidad,
            parsedPrecioUnitario,
            parsedDescuento,
        )];
    }

    private static parseDecimalValue(value: any, fieldName: string): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw `El ${fieldName} debe ser un numero valido`;
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw `El ${fieldName} debe ser un numero valido`;
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw `El ${fieldName} debe ser un numero valido`;
            return parsed;
        }
        throw `El ${fieldName} debe ser un numero valido`;
    }
}
