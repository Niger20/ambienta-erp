export class CreateCompraDto {

    private constructor(
        public readonly proveedorid: number,
        public readonly total: number,
        public readonly metodopago: string,
        public readonly tipocompra: string,
        public readonly facturaproveedor?: string | null,
        public readonly estado?: boolean,
        public readonly fecha?: Date | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateCompraDto?] {
        const { proveedorid, total, metodopago, tipocompra, facturaproveedor, estado, fecha } = props;

        if (proveedorid == null) return ['El proveedor id es obligatorio', undefined];
        const parsedProveedorId = Number(proveedorid);
        if (Number.isNaN(parsedProveedorId) || !Number.isInteger(parsedProveedorId)) {
            return ['El proveedor id debe ser un numero entero valido', undefined];
        }

        if (total == null) return ['El total es obligatorio', undefined];
        let parsedTotal: number;
        try {
            parsedTotal = CreateCompraDto.parseDecimalValue(total, 'total');
        } catch (e) {
            return [typeof e === 'string' ? e : 'El total debe ser un numero valido', undefined];
        }

        if (!metodopago) return ['El metodo de pago es obligatorio', undefined];
        if (typeof metodopago !== 'string') return ['El metodo de pago debe ser una cadena de texto', undefined];

        if (!tipocompra) return ['El tipo de compra es obligatorio', undefined];
        if (typeof tipocompra !== 'string') return ['El tipo de compra debe ser una cadena de texto', undefined];

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
        } else {
            parsedFecha = new Date();
        }

        return [undefined, new CreateCompraDto(
            parsedProveedorId,
            parsedTotal,
            metodopago,
            tipocompra,
            facturaproveedor ?? null,
            parsedEstado,
            parsedFecha ?? null,
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
}
