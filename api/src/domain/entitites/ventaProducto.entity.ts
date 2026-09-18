export class VentaProductoEntity {

    constructor(
        public readonly ventaid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly preciounitario: number,
        public readonly descuento: number,
        public readonly totalproducto: number,
        public readonly productonombre?: string | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): VentaProductoEntity {
        const { ventaid, productoid, cantidad, preciounitario, descuento, totalproducto } = object;

        const productonombre =
            object.productonombre ??
            object.productos?.nombre ??
            object.producto?.nombre ??
            null;

        if (ventaid == null) throw 'Venta ID es obligatorio';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (cantidad == null) throw 'Cantidad es obligatorio';
        if (preciounitario == null) throw 'Precio unitario es obligatorio';

        return new VentaProductoEntity(
            Number(ventaid),
            Number(productoid),
            Number(cantidad),
            Number(preciounitario),
            Number(descuento ?? 0),
            Number(totalproducto ?? 0),
            productonombre,
        );
    }
}
