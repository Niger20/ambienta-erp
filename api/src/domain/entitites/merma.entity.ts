export class MermaEntity {

    constructor(
        public readonly id: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly costounitario: number,
        public readonly costoperdida: number,
        public readonly motivo: string,
        public readonly usuarioid: number,
        public readonly fecha?: Date | null,
        public readonly movimientoid?: number | null,
        public readonly productonombre?: string | null,
        public readonly usuarionombre?: string | null,
        public readonly productodestinoid?: number | null,
        public readonly cantidaddestino?: number | null,
        public readonly movimientoingresoid?: number | null,
        public readonly productodestinonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): MermaEntity {
        const id = object.id ?? object.mermaid;
        const { productoid, cantidad, costounitario, costoperdida, motivo, usuarioid, fecha, movimientoid, productodestinoid, cantidaddestino, movimientoingresoid } = object;

        if (id == null) throw 'ID es obligatorio';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (cantidad == null) throw 'Cantidad es obligatoria';
        if (costounitario == null) throw 'Costo unitario es obligatorio';
        if (!motivo) throw 'Motivo es obligatorio';
        if (usuarioid == null) throw 'Usuario ID es obligatorio';

        const productonombre = object.productos?.nombre ?? object.productonombre ?? null;
        const usuarionombre = object.usuarios?.nombreusuario ?? object.usuarionombre ?? null;
        const productodestinonombre = object.productodestino?.nombre ?? object.productodestinonombre ?? null;

        const cantidadNum = Number(cantidad);
        const costoUnitNum = Number(costounitario);
        const costoPerdidaNum = costoperdida != null ? Number(costoperdida) : (cantidadNum * costoUnitNum);

        return new MermaEntity(
            Number(id),
            Number(productoid),
            cantidadNum,
            costoUnitNum,
            costoPerdidaNum,
            motivo,
            Number(usuarioid),
            fecha ? new Date(fecha) : null,
            movimientoid != null ? Number(movimientoid) : null,
            productonombre,
            usuarionombre,
            productodestinoid != null ? Number(productodestinoid) : null,
            cantidaddestino != null ? Number(cantidaddestino) : null,
            movimientoingresoid != null ? Number(movimientoingresoid) : null,
            productodestinonombre
        );
    }
}
