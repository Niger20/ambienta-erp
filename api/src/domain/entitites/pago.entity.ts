export class PagoEntity {

    constructor(
        public readonly id: number,
        public readonly monto: number,
        public readonly metodopago: string,
        public readonly estado: boolean,
        public readonly fecha?: Date | null,
    ) { }

    get isFechaAvailable() {
        return !!this.fecha;
    }

    public static fromObject(object: { [key: string]: any }): PagoEntity {
        const id = object.id ?? object.pagoid;
        const { fecha, monto, metodopago, estado } = object;

        if (id == null) throw 'ID is required';
        if (monto == null) throw 'Monto is required';

        const montoNumber = PagoEntity.parseMonto(monto);
        const estadoBoolean = estado != null ? PagoEntity.parseEstado(estado) : true;

        return new PagoEntity(
            Number(id),
            montoNumber,
            metodopago || 'Efectivo',
            estadoBoolean,
            fecha ?? null,
        );
    }

    private static parseMonto(value: any): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'Monto must be a valid number';
            return parsed;
        }

        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'Monto must be a valid number';
            return parsed;
        }

        throw 'Monto must be a valid number';
    }

    private static parseEstado(value: any): boolean {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            if (lower === 'true') return true;
            if (lower === 'false') return false;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        throw 'Estado must be a boolean';
    }
}
