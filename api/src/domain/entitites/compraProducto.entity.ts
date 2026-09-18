export class CompraProductoEntity {

    constructor(
        public readonly compraid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly preciounitario: number,
        public readonly descuento: number,
        public readonly totalproducto: number,
        public readonly productonombre?: string | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): CompraProductoEntity {
        const { compraid, productoid, cantidad, preciounitario, descuento, totalproducto } = object;

        const productonombre =
            object.productonombre ??
            object.productos?.nombre ??
            object.producto?.nombre ??
            null;

        if (compraid == null) throw 'Compra ID es obligatorio';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (cantidad == null) throw 'Cantidad es obligatorio';
        if (preciounitario == null) throw 'Precio unitario es obligatorio';

        return new CompraProductoEntity(
            Number(compraid),
            Number(productoid),
            Number(cantidad),
            Number(preciounitario),
            Number(descuento ?? 0),
            Number(totalproducto ?? 0),
            productonombre,
        );
    }
}
