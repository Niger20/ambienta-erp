export class UpdatePagoDto {

    private constructor(
        public readonly id: number,
        public readonly monto?: number,
        public readonly metodopago?: string,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.monto != null) returnObj.monto = this.monto;
        if (this.metodopago != null) returnObj.metodopago = this.metodopago;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fecha != null) returnObj.fecha = this.fecha;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdatePagoDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { monto, metodopago, estado, fecha } = props;

        let parsedMonto: number | undefined;
        if (monto != null) {
            try {
                parsedMonto = UpdatePagoDto.parseMonto(monto);
            } catch (error) {
                return [String(error), undefined];
            }
        }

        if (metodopago != null && typeof metodopago !== 'string') {
            return ['El metodo de pago debe ser una cadena de texto', undefined];
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = UpdatePagoDto.parseEstado(estado);
            if (estadoError) return [estadoError, undefined];
            parsedEstado = value;
        }

        let parsedFecha: Date | null | undefined;
        if (fecha != null) {
            const dateValue = fecha instanceof Date ? fecha : new Date(fecha);
            if (Number.isNaN(dateValue.getTime())) return ['La fecha debe ser una fecha valida', undefined];
            parsedFecha = dateValue;
        } else {
            parsedFecha = new Date();
        }

        return [undefined, new UpdatePagoDto(parsedId, parsedMonto, metodopago, parsedEstado, parsedFecha)];
    }

    private static parseMonto(value: any): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw 'El monto debe ser un numero valido';
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'El monto debe ser un numero valido';
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'El monto debe ser un numero valido';
            return parsed;
        }
        throw 'El monto debe ser un numero valido';
    }

    private static parseEstado(value: any): [string?, boolean?] {
        if (typeof value === 'boolean') return [undefined, value];
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            if (lower === 'true') return [undefined, true];
            if (lower === 'false') return [undefined, false];
        }
        if (typeof value === 'number') return [undefined, value !== 0];
        return ['El estado debe ser booleano', undefined];
    }
}
