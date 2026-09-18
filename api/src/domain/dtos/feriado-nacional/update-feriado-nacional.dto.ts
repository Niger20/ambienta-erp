export class UpdateFeriadoNacionalDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly fecha?: Date,
        public readonly esrecurrente?: boolean,
        public readonly activo?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        if (this.esrecurrente !== undefined) returnObj.esrecurrente = this.esrecurrente;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateFeriadoNacionalDto?] {
        const { id, fecha, esrecurrente, activo } = props;
        const nombre = props.nombre ?? props.descripcion;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedFecha: Date | undefined;
        if (fecha !== undefined) {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new UpdateFeriadoNacionalDto(
                parsedId,
                nombre ? String(nombre).trim() : undefined,
                parsedFecha,
                esrecurrente !== undefined ? Boolean(esrecurrente) : undefined,
                activo !== undefined ? Boolean(activo) : undefined
            )
        ];
    }
}
