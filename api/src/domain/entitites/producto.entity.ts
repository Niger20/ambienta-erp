export class ProductoEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly preciocompra: number,
        public readonly precioventa: number,
        public readonly codigobarra?: string | null,
        public readonly categoriaid?: number | null,
        public readonly categorianombre?: string | null,
        public readonly descripcion?: string | null,
        public readonly utilidad?: number | null,
        public readonly stockminimo?: number | null,
        public readonly stockactual?: number | null,
        public readonly fechavencimiento?: Date | null,
        public readonly estado?: boolean | null,
        public readonly publicadoencatalogo?: boolean | null,
        public readonly unidadmedidaid?: number | null,
        public readonly preciomayoreo?: number | null,
        public readonly cantidadminimamayoreo?: number | null,
        public readonly requierefechavencimiento?: boolean | null,
    ) {}

    get isCodigoBarraAvailable() {
        return !!this.codigobarra;
    }

    get isCategoriaAvailable() {
        return this.categoriaid != null;
    }

    get isCategoriaNombreAvailable() {
        return !!this.categorianombre;
    }

    get isDescripcionAvailable() {
        return !!this.descripcion;
    }

    get isUtilidadAvailable() {
        return this.utilidad != null;
    }

    get isStockMinimoAvailable() {
        return this.stockminimo != null;
    }

    get isStockActualAvailable() {
        return this.stockactual != null;
    }

    get isFechaVencimientoAvailable() {
        return this.fechavencimiento != null;
    }

    public static fromObject(object: { [key: string]: any }): ProductoEntity {
        const id = object.id ?? object.productoid;
        const {
            nombre,
            codigobarra,
            categoriaid,
            descripcion,
            preciocompra,
            precioventa,
            utilidad,
            stockminimo,
            stockactual,
            fechavencimiento,
            estado,
            publicadoencatalogo,
            unidadmedidaid,
            preciomayoreo,
            cantidadminimamayoreo,
            requierefechavencimiento,
        } = object;

        const categorianombre =
            object.categorianombre ??
            object.categoriaNombre ??
            object.categoriasproductos?.nombre ??
            object.categoria?.nombre ??
            object.categoryName;

        if (id == null) throw 'ID is required';
        if (!nombre) throw 'Nombre is required';
        if (preciocompra == null) throw 'PrecioCompra is required';
        if (precioventa == null) throw 'PrecioVenta is required';

        return new ProductoEntity(
            Number(id),
            nombre,
            Number(preciocompra),
            Number(precioventa),
            codigobarra,
            categoriaid != null ? Number(categoriaid) : null,
            categorianombre ?? null,
            descripcion,
            utilidad != null ? Number(utilidad) : null,
            stockminimo != null ? Number(stockminimo) : null,
            stockactual != null ? Number(stockactual) : null,
            fechavencimiento ? new Date(fechavencimiento) : null,
            estado ?? true,
            publicadoencatalogo != null ? Boolean(publicadoencatalogo) : false,
            unidadmedidaid != null ? Number(unidadmedidaid) : null,
            preciomayoreo != null ? Number(preciomayoreo) : null,
            cantidadminimamayoreo != null ? Number(cantidadminimamayoreo) : null,
            requierefechavencimiento != null ? Boolean(requierefechavencimiento) : false,
        );
    }
}
