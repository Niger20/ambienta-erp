export class UpdateVentaDto {

    private constructor(
        public readonly id: number,
        public readonly clienteid?: number | null,
        public readonly sesionid?: number,
        public readonly total?: number,
        public readonly tipoventa?: string,
        public readonly lugarventa?: string,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
        public readonly tipofactura?: string | null,
        public readonly metodopago?: string | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.clienteid !== undefined) returnObj.clienteid = this.clienteid;
        if (this.sesionid != null) returnObj.sesionid = this.sesionid;
        if (this.total != null) returnObj.total = this.total;
        if (this.tipoventa != null) returnObj.tipoventa = this.tipoventa;
        if (this.lugarventa != null) returnObj.lugarventa = this.lugarventa;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fecha != null) returnObj.fecha = this.fecha;
        if (this.tipofactura !== undefined) returnObj.tipofactura = this.tipofactura;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateVentaDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { clienteid, sesionid, total, metodopago, tipoventa, lugarventa, estado, fecha, tipofactura } = props;

        let parsedClienteId: number | null | undefined;
        if (clienteid !== undefined) {
            if (clienteid === null) {
                parsedClienteId = null;
            } else {
                const parsed = Number(clienteid);
                if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                    return ['El cliente id debe ser un numero entero valido', undefined];
                }
                parsedClienteId = parsed;
            }
        }

        let parsedSesionId: number | undefined;
        if (sesionid != null) {
            const parsed = Number(sesionid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El sesion id debe ser un numero entero valido', undefined];
            }
            parsedSesionId = parsed;
        }

        let parsedTotal: number | undefined;
        if (total != null) {
            parsedTotal = UpdateVentaDto.parseDecimalValue(total);
        }

        let parsedMetodoPago: string | null = null;
        if (metodopago != null && typeof metodopago === 'string') {
            parsedMetodoPago = metodopago.trim();
        }

        let parsedTipoFactura: string | null = null;
        if (tipofactura !== undefined) {
            parsedTipoFactura = tipofactura ? String(tipofactura).trim() : null;
        }

        if (tipoventa != null && typeof tipoventa !== 'string') {
            return ['El tipo de venta debe ser una cadena de texto', undefined];
        }

        if (lugarventa != null && typeof lugarventa !== 'string') {
            return ['El lugar de venta debe ser una cadena de texto', undefined];
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = UpdateVentaDto.parseEstado(estado);
            if (estadoError) return [estadoError, undefined];
            parsedEstado = value;
        }

        let parsedFecha: Date | null | undefined;
        if (fecha != null) {
            const dateValue = fecha instanceof Date ? fecha : new Date(fecha);
            if (Number.isNaN(dateValue.getTime())) return ['La fecha debe ser una fecha valida', undefined];
            parsedFecha = dateValue;
        }

        return [undefined, new UpdateVentaDto(
            parsedId,
            parsedClienteId,
            parsedSesionId,
            parsedTotal,
            tipoventa,
            lugarventa,
            parsedEstado,
            parsedFecha,
            parsedTipoFactura,
            parsedMetodoPago,
        )];
    }

    private static parseDecimalValue(value: any): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw 'El total debe ser un numero valido';
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'El total debe ser un numero valido';
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'El total debe ser un numero valido';
            return parsed;
        }
        throw 'El total debe ser un numero valido';
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
