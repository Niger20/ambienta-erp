export class UpdateVentaPagoDto {

    private constructor(
        public readonly id: number,
        public readonly ventaid?: number,
        public readonly metodopago?: string,
        public readonly monto?: number,
        public readonly banco?: string | null,
        public readonly numerotransferencia?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.ventaid != null) returnObj.ventaid = this.ventaid;
        if (this.metodopago != null) returnObj.metodopago = this.metodopago;
        if (this.monto != null) returnObj.monto = this.monto;
        if (this.banco !== undefined) returnObj.banco = this.banco;
        if (this.numerotransferencia !== undefined) returnObj.numerotransferencia = this.numerotransferencia;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateVentaPagoDto?] {
        const { id, ventaid, metodopago, monto, banco, numerotransferencia } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedVentaId: number | undefined;
        if (ventaid != null) {
            const parsed = Number(ventaid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['La venta ID debe ser un número entero válido', undefined];
            }
            parsedVentaId = parsed;
        }

        if (metodopago != null && typeof metodopago !== 'string') return ['El método de pago debe ser una cadena de texto', undefined];

        let parsedMonto: number | undefined;
        if (monto != null) {
            const parsed = Number(monto);
            if (Number.isNaN(parsed) || parsed <= 0) {
                return ['El monto debe ser un número positivo mayor a cero', undefined];
            }
            parsedMonto = parsed;
        }

        return [
            undefined,
            new UpdateVentaPagoDto(
                parsedId,
                parsedVentaId,
                metodopago?.trim().toUpperCase(),
                parsedMonto,
                banco !== undefined ? (banco ? String(banco).trim() : null) : undefined,
                numerotransferencia !== undefined ? (numerotransferencia ? String(numerotransferencia).trim() : null) : undefined
            )
        ];
    }
}
