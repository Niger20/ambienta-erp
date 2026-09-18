export class UpdateGastoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly descripcion?: string | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.descripcion !== undefined) returnObj.descripcion = this.descripcion;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateGastoDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { nombre, descripcion } = props;

        if (nombre != null && typeof nombre !== 'string') {
            return ['El nombre debe ser una cadena de texto', undefined];
        }

        if (descripcion != null && typeof descripcion !== 'string') {
            return ['La descripcion debe ser una cadena de texto', undefined];
        }

        return [undefined, new UpdateGastoDto(
            parsedId,
            nombre,
            descripcion,
        )];
    }
}
