export class DevolucionEntity {

    constructor(
        public readonly id: number,
        public readonly ventaid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly motivo: string,
        public readonly montodevuelto: number,
        public readonly usuarioid: number,
        public readonly fecha?: Date | null,
        public readonly usuarionombre?: string | null,
        public readonly productonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): DevolucionEntity {
        const id = object.id ?? object.devolucionid;
        const { ventaid, productoid, cantidad, motivo, montodevuelto, usuarioid, fecha } = object;

        if (id == null) throw 'ID es obligatorio';
        if (ventaid == null) throw 'Venta ID es obligatoria';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (cantidad == null) throw 'Cantidad es obligatoria';
        if (!motivo) throw 'Motivo es obligatorio';
        if (montodevuelto == null) throw 'Monto devuelto es obligatorio';
        if (usuarioid == null) throw 'Usuario ID es obligatorio';

        const usuarionombre = object.usuarios?.nombreusuario ?? object.usuarionombre ?? null;
        const productonombre = object.ventaproductos?.productos?.nombre ?? object.productonombre ?? null;

        return new DevolucionEntity(
            Number(id),
            Number(ventaid),
            Number(productoid),
            Number(cantidad),
            motivo,
            Number(montodevuelto),
            Number(usuarioid),
            fecha ? new Date(fecha) : null,
            usuarionombre,
            productonombre
        );
    }
}
