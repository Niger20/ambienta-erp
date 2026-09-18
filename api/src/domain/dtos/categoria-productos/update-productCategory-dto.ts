


export class UpdateProductCategoryDto {


    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly descripcion?: string,
    ) {}

    get values () {
        const returnObj: { [key: string]: any} = {};

        if (this.nombre) returnObj.nombre = this.nombre;
        if (this.descripcion) returnObj.descripcion = this.descripcion;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateProductCategoryDto?] {

        const { id, nombre, descripcion } = props;

        if ( !id || isNaN( Number(id) ) ) return ['El id es obligatorio y debe ser un número', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (typeof descripcion !== 'string') return ['La descripcion debe ser una cadena de texto', undefined];


        return [undefined, new UpdateProductCategoryDto(id, nombre, descripcion)];

    }
}