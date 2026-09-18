export class CreatePagoDto {

    private constructor(
        public readonly monto: number,
        public readonly metodopago: string,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreatePagoDto?] {
        const { monto, metodopago, estado, fecha } = props;

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = CreatePagoDto.parseMonto(monto);

        if (!metodopago) return ['El metodo de pago es obligatorio', undefined];
        if (typeof metodopago !== 'string') return ['El metodo de pago debe ser una cadena de texto', undefined];

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = CreatePagoDto.parseEstado(estado);
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

        return [undefined, new CreatePagoDto(parsedMonto, metodopago, parsedEstado, parsedFecha ?? null)];
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