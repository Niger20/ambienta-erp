export class UpdateDeliveryDto {

    private constructor(
        public readonly id: number,
        public readonly repartidorid?: number,
        public readonly direccionentrega?: string,
        public readonly costo?: number,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.repartidorid != null) returnObj.repartidorid = this.repartidorid;
        if (this.direccionentrega != null) returnObj.direccionentrega = this.direccionentrega;
        if (this.costo != null) returnObj.costo = this.costo;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fecha != null) returnObj.fecha = this.fecha;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateDeliveryDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { repartidorid, direccionentrega, costo, estado, fecha } = props;

        let parsedRepartidorId: number | undefined;
        if (repartidorid != null) {
            const parsed = Number(repartidorid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El repartidor id debe ser un numero entero valido', undefined];
            }
            parsedRepartidorId = parsed;
        }

        if (direccionentrega != null && typeof direccionentrega !== 'string') {
            return ['La direccion de entrega debe ser una cadena de texto', undefined];
        }

        let parsedCosto: number | undefined;
        if (costo != null) {
            parsedCosto = UpdateDeliveryDto.parseDecimalValue(costo);
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = UpdateDeliveryDto.parseEstado(estado);
            if (estadoError) return [estadoError, undefined];
            parsedEstado = value;
        }

        let parsedFecha: Date | null | undefined;
        if (fecha != null) {
            const dateValue = fecha instanceof Date ? fecha : new Date(fecha);
            if (Number.isNaN(dateValue.getTime())) return ['La fecha debe ser una fecha valida', undefined];
            parsedFecha = dateValue;
        }

        return [undefined, new UpdateDeliveryDto(
            parsedId,
            parsedRepartidorId,
            direccionentrega,
            parsedCosto,
            parsedEstado,
            parsedFecha,
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
