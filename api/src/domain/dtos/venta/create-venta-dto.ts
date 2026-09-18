export class CreateVentaDto {

    private constructor(
        public readonly sesionid: number,
        public readonly total: number,
        public readonly tipoventa: string,
        public readonly lugarventa: string,
        public readonly clienteid?: number | null,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
        public readonly tipofactura?: string | null,
        public readonly metodopago?: string | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateVentaDto?] {
        const { sesionid, total, metodopago, tipoventa, lugarventa, clienteid, estado, fecha, tipofactura } = props;

        if (sesionid == null) return ['El sesion id es obligatorio', undefined];
        const parsedSesionId = Number(sesionid);
        if (Number.isNaN(parsedSesionId) || !Number.isInteger(parsedSesionId)) {
            return ['El sesion id debe ser un numero entero valido', undefined];
        }

        if (total == null) return ['El total es obligatorio', undefined];
        const parsedTotal = CreateVentaDto.parseDecimalValue(total, 'total');

        if (!tipoventa) return ['El tipo de venta es obligatorio', undefined];
        if (typeof tipoventa !== 'string') return ['El tipo de venta debe ser una cadena de texto', undefined];

        if (!lugarventa) return ['El lugar de venta es obligatorio', undefined];
        if (typeof lugarventa !== 'string') return ['El lugar de venta debe ser una cadena de texto', undefined];

        let parsedClienteId: number | null | undefined = null;
        if (clienteid != null) {
            const parsed = Number(clienteid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El cliente id debe ser un numero entero valido', undefined];
            }
            parsedClienteId = parsed;
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = CreateVentaDto.parseEstado(estado);
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

        let parsedMetodoPago: string | null = null;
        if (metodopago != null && typeof metodopago === 'string') {
            parsedMetodoPago = metodopago.trim();
        }

        let parsedTipoFactura: string | null = null;
        if (tipofactura != null && typeof tipofactura === 'string') {
            parsedTipoFactura = tipofactura.trim();
        }

        return [undefined, new CreateVentaDto(
            parsedSesionId,
            parsedTotal,
            tipoventa,
            lugarventa,
            parsedClienteId,
            parsedEstado,
            parsedFecha ?? null,
            parsedTipoFactura,
            parsedMetodoPago,
        )];
    }

    private static parseDecimalValue(value: any, fieldName: string): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw `El ${fieldName} debe ser un numero valido`;
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw `El ${fieldName} debe ser un numero valido`;
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw `El ${fieldName} debe ser un numero valido`;
            return parsed;
        }
        throw `El ${fieldName} debe ser un numero valido`;
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
