


export class CreateProductCategoryDto {


    private constructor(
        public readonly nombre: string,
        public readonly descripcion?: string,
    ) {}

    static create(props: {[key: string]: any}): [string?, CreateProductCategoryDto?] {

        const { nombre, descripcion } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (typeof descripcion !== 'string') return ['La descripcion debe ser una cadena de texto', undefined];


        return [undefined, new CreateProductCategoryDto(nombre, descripcion)];

    }
}