export class OrdenCompraProductoEntity {

    constructor(
        public readonly ordencompraid: number,
        public readonly productoid: number,
        public readonly cantidadordenada: number,
        public readonly preciounitario: number,
        public readonly productonombre?: string | null,
        public readonly productocodigo?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): OrdenCompraProductoEntity {
        const { ordencompraid, productoid, cantidadordenada, preciounitario } = object;

        if (ordencompraid == null) throw 'Orden de compra ID es obligatoria';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (cantidadordenada == null) throw 'Cantidad ordenada es obligatoria';
        if (preciounitario == null) throw 'Precio unitario es obligatorio';

        const productonombre = object.productos?.nombre ?? object.productonombre ?? null;
        const productocodigo = object.productos?.codigobarra ?? object.productocodigo ?? null;

        return new OrdenCompraProductoEntity(
            Number(ordencompraid),
            Number(productoid),
            Number(cantidadordenada),
            Number(preciounitario),
            productonombre,
            productocodigo
        );
    }
}
