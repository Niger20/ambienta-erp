export class CreateCompraProductoDto {

    private constructor(
        public readonly compraid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly preciounitario?: number,
        public readonly descuento?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateCompraProductoDto?] {
        const { compraid, productoid, cantidad, preciounitario, descuento } = props;

        if (compraid == null) return ['El compra id es obligatorio', undefined];
        const parsedCompraId = Number(compraid);
        if (Number.isNaN(parsedCompraId) || !Number.isInteger(parsedCompraId)) {
            return ['El compra id debe ser un numero entero valido', undefined];
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
            try {
                parsedPrecioUnitario = CreateCompraProductoDto.parseDecimalValue(preciounitario, 'precio unitario');
            } catch (e) {
                return [typeof e === 'string' ? e : 'El precio unitario debe ser un numero valido', undefined];
            }
            if (parsedPrecioUnitario < 0) {
                return ['El precio unitario no puede ser negativo', undefined];
            }
        }

        let parsedDescuento: number | undefined;
        if (descuento != null) {
            try {
                parsedDescuento = CreateCompraProductoDto.parseDecimalValue(descuento, 'descuento');
            } catch (e) {
                return [typeof e === 'string' ? e : 'El descuento debe ser un numero valido', undefined];
            }
            if (parsedDescuento < 0) {
                return ['El descuento no puede ser negativo', undefined];
            }
        }

        return [undefined, new CreateCompraProductoDto(
            parsedCompraId,
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
