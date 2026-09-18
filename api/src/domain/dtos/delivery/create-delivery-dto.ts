export class CreateDeliveryDto {

    private constructor(
        public readonly repartidorid: number,
        public readonly direccionentrega: string,
        public readonly costo: number,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateDeliveryDto?] {
        const { repartidorid, direccionentrega, costo, estado, fecha } = props;

        if (repartidorid == null) return ['El repartidor id es obligatorio', undefined];
        const parsedRepartidorId = Number(repartidorid);
        if (Number.isNaN(parsedRepartidorId) || !Number.isInteger(parsedRepartidorId)) {
            return ['El repartidor id debe ser un numero entero valido', undefined];
        }

        if (!direccionentrega) return ['La direccion de entrega es obligatoria', undefined];
        if (typeof direccionentrega !== 'string') return ['La direccion de entrega debe ser una cadena de texto', undefined];

        if (costo == null) return ['El costo es obligatorio', undefined];
        const parsedCosto = CreateDeliveryDto.parseDecimalValue(costo);

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = CreateDeliveryDto.parseEstado(estado);
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

        return [undefined, new CreateDeliveryDto(
            parsedRepartidorId,
            direccionentrega,
            parsedCosto,
            parsedEstado,
            parsedFecha ?? null,
        )];
    }

    private static parseDecimalValue(value: any): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw 'El costo debe ser un numero valido';
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'El costo debe ser un numero valido';
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'El costo debe ser un numero valido';
            return parsed;
        }
        throw 'El costo debe ser un numero valido';
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