export class UpdateConfiguracionInssDto {

    private constructor(
        public readonly id: number,
        public readonly tasalaboral?: number,
        public readonly tasapatronal?: number,
        public readonly fechavigencia?: Date,
        public readonly fechafinvigencia?: Date | null,
        public readonly activo?: boolean,
        public readonly observaciones?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.tasalaboral != null) returnObj.tasalaboral = this.tasalaboral;
        if (this.tasapatronal != null) returnObj.tasapatronal = this.tasapatronal;
        if (this.fechavigencia !== undefined) returnObj.fechavigencia = this.fechavigencia;
        if (this.fechafinvigencia !== undefined) returnObj.fechafinvigencia = this.fechafinvigencia;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateConfiguracionInssDto?] {
        const { id, tasalaboral, tasapatronal, fechavigencia, fechafinvigencia, activo, observaciones } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedVigencia: Date | undefined;
        if (fechavigencia !== undefined) {
            const d = new Date(fechavigencia);
            if (isNaN(d.getTime())) return ['La fecha de vigencia es inválida', undefined];
            parsedVigencia = d;
        }

        let parsedFin: Date | null | undefined;
        if (fechafinvigencia !== undefined) {
            if (fechafinvigencia === null) {
                parsedFin = null;
            } else {
                const d = new Date(fechafinvigencia);
                if (!isNaN(d.getTime())) parsedFin = d;
            }
        }

        return [
            undefined,
            new UpdateConfiguracionInssDto(
                parsedId,
                tasalaboral != null ? Number(tasalaboral) : undefined,
                tasapatronal != null ? Number(tasapatronal) : undefined,
                parsedVigencia,
                parsedFin,
                activo !== undefined ? Boolean(activo) : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined
            )
        ];
    }
}
