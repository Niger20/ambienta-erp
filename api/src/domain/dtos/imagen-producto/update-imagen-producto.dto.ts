export class UpdateImagenProductoDto {

    private constructor(
        public readonly id: number,
        public readonly productoid?: number,
        public readonly urlimagen?: string,
        public readonly esprincipal?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.productoid != null) returnObj.productoid = this.productoid;
        if (this.urlimagen != null) returnObj.urlimagen = this.urlimagen;
        if (this.esprincipal != null) returnObj.esprincipal = this.esprincipal;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateImagenProductoDto?] {
        const { id, productoid, urlimagen, esprincipal } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedProductoId: number | undefined;
        if (productoid != null) {
            const parsed = Number(productoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El producto ID debe ser un número entero válido', undefined];
            }
            parsedProductoId = parsed;
        }

        if (urlimagen != null && typeof urlimagen !== 'string') return ['La URL de la imagen debe ser una cadena de texto', undefined];

        return [
            undefined,
            new UpdateImagenProductoDto(
                parsedId,
                parsedProductoId,
                urlimagen?.trim(),
                esprincipal != null ? Boolean(esprincipal) : undefined
            )
        ];
    }
}
