export class CreateImagenProductoDto {

    private constructor(
        public readonly productoid: number,
        public readonly urlimagen: string,
        public readonly esprincipal: boolean = false,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateImagenProductoDto?] {
        const { productoid, urlimagen, esprincipal } = props;

        if (productoid == null) return ['El producto ID es obligatorio', undefined];
        const parsedProductoId = Number(productoid);
        if (Number.isNaN(parsedProductoId) || !Number.isInteger(parsedProductoId)) {
            return ['El producto ID debe ser un número entero válido', undefined];
        }

        if (!urlimagen) return ['La URL de la imagen es obligatoria', undefined];
        if (typeof urlimagen !== 'string') return ['La URL de la imagen debe ser una cadena de texto', undefined];

        return [
            undefined,
            new CreateImagenProductoDto(
                parsedProductoId,
                urlimagen.trim(),
                Boolean(esprincipal)
            )
        ];
    }
}
