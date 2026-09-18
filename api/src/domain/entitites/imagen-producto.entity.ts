export class ImagenProductoEntity {

    constructor(
        public readonly id: number,
        public readonly productoid: number,
        public readonly urlimagen: string,
        public readonly esprincipal: boolean = false,
        public readonly productonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): ImagenProductoEntity {
        const id = object.id ?? object.imagenid;
        const { productoid, urlimagen, esprincipal } = object;

        if (id == null) throw 'ID es obligatorio';
        if (productoid == null) throw 'Producto ID es obligatorio';
        if (!urlimagen) throw 'La URL de la imagen es obligatoria';

        const productonombre = object.productos?.nombre ?? object.productonombre ?? null;

        return new ImagenProductoEntity(
            Number(id),
            Number(productoid),
            urlimagen,
            Boolean(esprincipal),
            productonombre
        );
    }
}
