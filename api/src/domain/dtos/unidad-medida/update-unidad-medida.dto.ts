export class UpdateUnidadMedidaDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly abreviatura?: string,
        public readonly permitefraccionamiento?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.abreviatura != null) returnObj.abreviatura = this.abreviatura;
        if (this.permitefraccionamiento != null) returnObj.permitefraccionamiento = this.permitefraccionamiento;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateUnidadMedidaDto?] {
        const { id, nombre, abreviatura, permitefraccionamiento } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (abreviatura != null && typeof abreviatura !== 'string') return ['La abreviatura debe ser una cadena de texto', undefined];

        return [
            undefined,
            new UpdateUnidadMedidaDto(
                parsedId,
                nombre?.trim(),
                abreviatura?.trim().toUpperCase(),
                permitefraccionamiento != null ? Boolean(permitefraccionamiento) : undefined
            )
        ];
    }
}
