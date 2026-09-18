export class UpdateDepartamentoEmpleadoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly descripcion?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.descripcion !== undefined) returnObj.descripcion = this.descripcion;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateDepartamentoEmpleadoDto?] {
        const { id, nombre, descripcion } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        return [
            undefined,
            new UpdateDepartamentoEmpleadoDto(
                parsedId,
                nombre?.trim(),
                descripcion !== undefined ? (descripcion ? String(descripcion).trim() : null) : undefined
            )
        ];
    }
}
