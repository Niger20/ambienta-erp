export class UtilidadProductoEntity {
    constructor(
        public readonly productoid: number,
        public readonly codigobarra: string | null,
        public readonly nombre: string,
        public readonly categoria: string | null,
        public readonly cantidadVendida: number,
        public readonly totalGenerado: number,
        public readonly totalCosto: number,
        public readonly utilidad: number,
        public readonly margen: number,
    ) { }

    public static fromObject(object: { [key: string]: any }): UtilidadProductoEntity {
        const {
            productoid,
            codigobarra,
            nombre,
            categoria,
            cantidadVendida,
            totalGenerado,
            totalCosto,
            utilidad,
            margen,
        } = object;

        if (!productoid) throw 'productoid is required';
        if (!nombre) throw 'nombre is required';
        if (cantidadVendida === undefined) throw 'cantidadVendida is required';
        if (totalGenerado === undefined) throw 'totalGenerado is required';
        if (totalCosto === undefined) throw 'totalCosto is required';
        if (utilidad === undefined) throw 'utilidad is required';
        if (margen === undefined) throw 'margen is required';

        return new UtilidadProductoEntity(
            productoid,
            codigobarra || null,
            nombre,
            categoria || null,
            Number(cantidadVendida),
            Number(totalGenerado),
            Number(totalCosto),
            Number(utilidad),
            Number(margen)
        );
    }
}
