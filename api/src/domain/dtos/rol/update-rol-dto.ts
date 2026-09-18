export class UpdateRolDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly descripcion?: string,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.descripcion != null) returnObj.descripcion = this.descripcion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateRolDto?] {
        const { id, nombre, descripcion } = props;

        if (!id || isNaN(Number(id))) return ['El id es obligatorio y debe ser un número', undefined];
        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (descripcion != null && typeof descripcion !== 'string') return ['La descripcion debe ser una cadena de texto', undefined];

        return [undefined, new UpdateRolDto(Number(id), nombre?.trim(), descripcion)];
    }
}
