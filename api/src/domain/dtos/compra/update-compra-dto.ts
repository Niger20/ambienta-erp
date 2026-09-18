export interface UpdateCompraLineaDto {
    productoid: number;
    cantidad: number;
    preciounitario: number;
    descuento?: number;
}

export interface UpdateCompraCostoAdicionalDto {
    concepto: string;
    monto: number;
}

export class UpdateCompraDto {

    private constructor(
        public readonly id: number,
        public readonly proveedorid?: number,
        public readonly total?: number,
        public readonly metodopago?: string,
        public readonly tipocompra?: string,
        public readonly facturaproveedor?: string | null,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
        public readonly lineas?: UpdateCompraLineaDto[],
        public readonly costosAdicionales?: UpdateCompraCostoAdicionalDto[],
        public readonly cuotas?: number,
        public readonly fechavencimiento?: Date | string | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.proveedorid != null) returnObj.proveedorid = this.proveedorid;
        if (this.total != null) returnObj.total = this.total;
        if (this.metodopago != null) returnObj.metodopago = this.metodopago;
        if (this.tipocompra != null) returnObj.tipocompra = this.tipocompra;
        if (this.facturaproveedor !== undefined) returnObj.facturaproveedor = this.facturaproveedor;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fecha != null) returnObj.fecha = this.fecha;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCompraDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const {
            proveedorid,
            total,
            metodopago,
            tipocompra,
            facturaproveedor,
            estado,
            fecha,
            lineas,
            costosAdicionales,
            cuotas,
            fechavencimiento,
        } = props;

        let parsedProveedorId: number | undefined;
        if (proveedorid != null) {
            const parsed = Number(proveedorid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El proveedor id debe ser un numero entero valido', undefined];
            }
            parsedProveedorId = parsed;
        }

        let parsedTotal: number | undefined;
        if (total != null) {
            try {
                parsedTotal = UpdateCompraDto.parseDecimalValue(total);
            } catch (err: any) {
                return [typeof err === 'string' ? err : 'Total invalido', undefined];
            }
        }

        if (metodopago != null && typeof metodopago !== 'string') {
            return ['El metodo de pago debe ser una cadena de texto', undefined];
        }

        if (tipocompra != null && typeof tipocompra !== 'string') {
            return ['El tipo de compra debe ser una cadena de texto', undefined];
        }

        if (facturaproveedor != null && typeof facturaproveedor !== 'string') {
            return ['La factura del proveedor debe ser una cadena de texto', undefined];
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            if (typeof estado === 'boolean') parsedEstado = estado;
            else if (typeof estado === 'string') {
                const lower = estado.toLowerCase();
                if (lower === 'true') parsedEstado = true;
                else if (lower === 'false') parsedEstado = false;
                else return ['El estado debe ser booleano', undefined];
            } else return ['El estado debe ser booleano', undefined];
        }

        let parsedFecha: Date | null | undefined;
        if (fecha != null) {
            const dateValue = fecha instanceof Date ? fecha : new Date(fecha);
            if (Number.isNaN(dateValue.getTime())) return ['La fecha debe ser una fecha valida', undefined];
            parsedFecha = dateValue;
        }

        let parsedLineas: UpdateCompraLineaDto[] | undefined;
        if (lineas != null) {
            if (!Array.isArray(lineas)) return ['Las lineas deben ser un arreglo', undefined];
            parsedLineas = [];
            for (let i = 0; i < lineas.length; i++) {
                const l = lineas[i];
                const pid = Number(l.productoid);
                const cant = Number(l.cantidad);
                const precio = Number(l.preciounitario);
                const desc = l.descuento != null ? Number(l.descuento) : 0;
                if (!pid || Number.isNaN(pid)) return [`La linea ${i + 1} tiene un productoid invalido`, undefined];
                if (Number.isNaN(cant) || cant <= 0) return [`La linea ${i + 1} debe tener una cantidad mayor a 0`, undefined];
                if (Number.isNaN(precio) || precio < 0) return [`La linea ${i + 1} debe tener un precio unitario valido`, undefined];
                parsedLineas.push({
                    productoid: pid,
                    cantidad: cant,
                    preciounitario: precio,
                    descuento: Number.isNaN(desc) ? 0 : desc,
                });
            }
        }

        let parsedCostos: UpdateCompraCostoAdicionalDto[] | undefined;
        if (costosAdicionales != null) {
            if (!Array.isArray(costosAdicionales)) return ['Los costos adicionales deben ser un arreglo', undefined];
            parsedCostos = [];
            for (let i = 0; i < costosAdicionales.length; i++) {
                const ca = costosAdicionales[i];
                const concepto = String(ca.concepto || '').trim();
                const monto = Number(ca.monto);
                if (monto > 0 && concepto) {
                    parsedCostos.push({ concepto, monto });
                }
            }
        }

        let parsedCuotas: number | undefined;
        if (cuotas != null) {
            const c = Number(cuotas);
            if (!Number.isNaN(c) && c > 0) parsedCuotas = c;
        }

        let parsedFechaVencimiento: Date | string | null | undefined = fechavencimiento;
        if (fechavencimiento != null) {
            const d = fechavencimiento instanceof Date ? fechavencimiento : new Date(fechavencimiento);
            if (!Number.isNaN(d.getTime())) parsedFechaVencimiento = d;
        }

        return [undefined, new UpdateCompraDto(
            parsedId,
            parsedProveedorId,
            parsedTotal,
            metodopago,
            tipocompra,
            facturaproveedor,
            parsedEstado,
            parsedFecha,
            parsedLineas,
            parsedCostos,
            parsedCuotas,
            parsedFechaVencimiento,
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
}
