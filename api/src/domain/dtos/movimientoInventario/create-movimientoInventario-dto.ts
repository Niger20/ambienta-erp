export class CreateMovimientoInventarioDto {

    private constructor(
        public readonly productoid: number,
        public readonly tipomovimiento: string,
        public readonly cantidad: number,
        public readonly motivo: string,
        public readonly stockanterior?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateMovimientoInventarioDto?] {
        const { productoid, tipomovimiento, cantidad, motivo, stockanterior } = props;

        if (productoid == null) return ['El producto id es obligatorio', undefined];
        const parsedProductoId = Number(productoid);
        if (Number.isNaN(parsedProductoId) || !Number.isInteger(parsedProductoId)) {
            return ['El producto id debe ser un numero entero valido', undefined];
        }

        if (!tipomovimiento) return ['El tipo de movimiento es obligatorio', undefined];
        if (typeof tipomovimiento !== 'string') return ['El tipo de movimiento debe ser una cadena de texto', undefined];

        const rawTipo = tipomovimiento.trim().toUpperCase();
        let finalTipoMovimiento: string;
        if (['SALIDA', 'EGRESO', 'VENTA', 'OUT'].includes(rawTipo)) {
            finalTipoMovimiento = 'EGRESO';
        } else if (['ENTRADA', 'INGRESO', 'COMPRA', 'IN'].includes(rawTipo)) {
            finalTipoMovimiento = 'INGRESO';
        } else if (['MERMA', 'WASTE', 'DAMAGE'].includes(rawTipo)) {
            finalTipoMovimiento = 'MERMA';
        } else if (['DEVOLUCION', 'RETURN'].includes(rawTipo)) {
            finalTipoMovimiento = 'DEVOLUCION';
        } else if (['AJUSTE', 'ADJUSTMENT'].includes(rawTipo)) {
            finalTipoMovimiento = 'AJUSTE';
        } else {
            return ['El tipo de movimiento debe ser INGRESO, EGRESO, AJUSTE, MERMA o DEVOLUCION', undefined];
        }

        if (cantidad == null) return ['La cantidad es obligatoria', undefined];
        const parsedCantidad = Number(cantidad);
        if (Number.isNaN(parsedCantidad)) {
            return ['La cantidad debe ser un numero valido', undefined];
        }

        if (!motivo) return ['El motivo es obligatorio', undefined];
        if (typeof motivo !== 'string') return ['El motivo debe ser una cadena de texto', undefined];

        let parsedStockAnterior: number | undefined;
        if (stockanterior != null) {
            const parsed = Number(stockanterior);
            if (Number.isNaN(parsed)) {
                return ['El stock anterior debe ser un numero valido', undefined];
            }
            parsedStockAnterior = parsed;
        }

        return [undefined, new CreateMovimientoInventarioDto(
            parsedProductoId,
            finalTipoMovimiento,
            parsedCantidad,
            motivo,
            parsedStockAnterior,
        )];
    }
}
