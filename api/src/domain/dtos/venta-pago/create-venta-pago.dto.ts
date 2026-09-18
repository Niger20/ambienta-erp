export class CreateVentaPagoDto {

    private constructor(
        public readonly ventaid: number,
        public readonly metodopago: string,
        public readonly monto: number,
        public readonly banco?: string | null,
        public readonly numerotransferencia?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateVentaPagoDto?] {
        const { ventaid, metodopago, monto, banco, numerotransferencia } = props;

        if (ventaid == null) return ['La venta ID es obligatoria', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['La venta ID debe ser un número entero válido', undefined];
        }

        if (!metodopago) return ['El método de pago es obligatorio', undefined];
        if (typeof metodopago !== 'string') return ['El método de pago debe ser una cadena de texto', undefined];

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) {
            return ['El monto debe ser un número positivo mayor a cero', undefined];
        }

        const rawMetodo = metodopago.trim().toUpperCase();
        let finalMetodoPago: string;
        let finalBanco: string | null = banco ? String(banco).trim() : null;
        let finalNumeroTransferencia: string | null = numerotransferencia ? String(numerotransferencia).trim() : null;

        if (['BAC', 'LAFISE', 'BANPRO', 'TRANSFERENCIA', 'TRANSFER', 'TRANS'].includes(rawMetodo)) {
            finalMetodoPago = 'TRANSFERENCIA';
            if (!finalBanco) finalBanco = rawMetodo === 'TRANSFERENCIA' ? 'BANCO' : rawMetodo;
            if (!finalNumeroTransferencia) finalNumeroTransferencia = 'N/A';
        } else if (['TARJETA', 'CARD', 'DEBITO', 'CREDITO_TARJETA'].includes(rawMetodo)) {
            finalMetodoPago = 'TARJETA';
            if (!finalBanco) finalBanco = 'TARJETA';
            finalNumeroTransferencia = null; // chk_numero_transferencia requires null if MetodoPago <> 'TRANSFERENCIA'
        } else {
            // EFECTIVO and fallback
            finalMetodoPago = 'EFECTIVO';
            finalBanco = null; // chk_banco_requerido requires null if MetodoPago = 'EFECTIVO'
            finalNumeroTransferencia = null; // chk_numero_transferencia requires null if MetodoPago <> 'TRANSFERENCIA'
        }

        return [
            undefined,
            new CreateVentaPagoDto(
                parsedVentaId,
                finalMetodoPago,
                parsedMonto,
                finalBanco,
                finalNumeroTransferencia
            )
        ];
    }
}
