export class UpdateRegistroAsistenciaDto {

    private constructor(
        public readonly id: number,
        public readonly empleadoid?: number,
        public readonly fecha?: Date,
        public readonly horaentrada?: Date | null,
        public readonly horasalida?: Date | null,
        public readonly horastrabajadas?: number | null,
        public readonly horasextra?: number,
        public readonly tipoausencia?: string | null,
        public readonly observaciones?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.empleadoid != null) returnObj.empleadoid = this.empleadoid;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        if (this.horaentrada !== undefined) returnObj.horaentrada = this.horaentrada;
        if (this.horasalida !== undefined) returnObj.horasalida = this.horasalida;
        if (this.horastrabajadas !== undefined) returnObj.horastrabajadas = this.horastrabajadas;
        if (this.horasextra != null) returnObj.horasextra = this.horasextra;
        if (this.tipoausencia !== undefined) returnObj.tipoausencia = this.tipoausencia;
        if (this.observaciones !== undefined) returnObj.observaciones = this.observaciones;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateRegistroAsistenciaDto?] {
        const {
            id,
            empleadoid,
            fecha,
            horaentrada,
            horainicio,
            horasalida,
            horafin,
            horastrabajadas,
            horasextra,
            tipoausencia,
            observaciones
        } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedEmpleadoId: number | undefined;
        if (empleadoid != null) {
            const parsed = Number(empleadoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El empleado ID debe ser un número entero válido', undefined];
            }
            parsedEmpleadoId = parsed;
        }

        let parsedFecha: Date | undefined;
        if (fecha !== undefined) {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
            parsedFecha = d;
        }

        let parsedEntrada: Date | null | undefined;
        const inputEntrada = horaentrada ?? horainicio;
        if (inputEntrada !== undefined) {
            if (inputEntrada === null) {
                parsedEntrada = null;
            } else {
                const d = new Date(inputEntrada);
                if (!isNaN(d.getTime())) parsedEntrada = d;
            }
        }

        let parsedSalida: Date | null | undefined;
        const inputSalida = horasalida ?? horafin;
        if (inputSalida !== undefined) {
            if (inputSalida === null) {
                parsedSalida = null;
            } else {
                const d = new Date(inputSalida);
                if (!isNaN(d.getTime())) parsedSalida = d;
            }
        }

        return [
            undefined,
            new UpdateRegistroAsistenciaDto(
                parsedId,
                parsedEmpleadoId,
                parsedFecha,
                parsedEntrada,
                parsedSalida,
                horastrabajadas !== undefined ? (horastrabajadas != null ? Number(horastrabajadas) : null) : undefined,
                horasextra != null ? Number(horasextra) : undefined,
                tipoausencia !== undefined ? (tipoausencia ? String(tipoausencia).trim() : null) : undefined,
                observaciones !== undefined ? (observaciones ? String(observaciones).trim() : null) : undefined
            )
        ];
    }
}
