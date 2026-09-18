export class UpdateAuditoriaDto {

    private constructor(
        public readonly id: number,
        public readonly tabla?: string,
        public readonly operacion?: string,
        public readonly usuarioid?: number | null,
        public readonly datosanteriores?: any,
        public readonly datosnuevos?: any,
        public readonly fecha?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.tabla != null) returnObj.tabla = this.tabla;
        if (this.operacion != null) returnObj.operacion = this.operacion;
        if (this.usuarioid !== undefined) returnObj.usuarioid = this.usuarioid;
        if (this.datosanteriores !== undefined) returnObj.datosanteriores = this.datosanteriores;
        if (this.datosnuevos !== undefined) returnObj.datosnuevos = this.datosnuevos;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateAuditoriaDto?] {
        const { id, tabla, operacion, usuarioid, datosanteriores, datosnuevos, fecha } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        if (tabla != null && typeof tabla !== 'string') return ['La tabla debe ser una cadena de texto', undefined];
        if (operacion != null && typeof operacion !== 'string') return ['La operación debe ser una cadena de texto', undefined];

        let parsedUsuarioId: number | null | undefined;
        if (usuarioid !== undefined) {
            if (usuarioid === null) {
                parsedUsuarioId = null;
            } else {
                const parsed = Number(usuarioid);
                if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                    return ['El usuario ID debe ser un número entero válido', undefined];
                }
                parsedUsuarioId = parsed;
            }
        }

        let parsedFecha: Date | null | undefined;
        if (fecha !== undefined) {
            if (fecha === null) {
                parsedFecha = null;
            } else {
                const d = new Date(fecha);
                if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
                parsedFecha = d;
            }
        }

        return [
            undefined,
            new UpdateAuditoriaDto(
                parsedId,
                tabla?.trim(),
                operacion?.trim().toUpperCase(),
                parsedUsuarioId,
                datosanteriores,
                datosnuevos,
                parsedFecha
            )
        ];
    }
}
