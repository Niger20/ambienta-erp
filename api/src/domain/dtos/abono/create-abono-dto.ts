export class CreateAbonoDto {

    private constructor(
        public readonly cuentaid: number,
        public readonly monto: number,
        public readonly metodopago: string,
        public readonly fecha?: Date,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateAbonoDto?] {
        const { cuentaid, monto, metodopago, fecha } = props;

        if (cuentaid == null) return ['El cuenta id es obligatorio', undefined];
        const parsedCuentaId = Number(cuentaid);
        if (Number.isNaN(parsedCuentaId) || !Number.isInteger(parsedCuentaId)) {
            return ['El cuenta id debe ser un numero entero valido', undefined];
        }

        if (monto == null) return ['El monto es obligatorio', undefined];
        const parsedMonto = Number(monto);
        if (Number.isNaN(parsedMonto)) {
            return ['El monto debe ser un numero', undefined];
        }

        if (!metodopago) return ['El metodo de pago es obligatorio', undefined];
        if (typeof metodopago !== 'string') return ['El metodo de pago debe ser una cadena de texto', undefined];
        const metodosValidos = ['efectivo', 'bac', 'lafise', 'banpro', 'credito', 'transferencia'];
        if (!metodosValidos.includes(metodopago.toLowerCase())) {
            return [`El metodo de pago debe ser uno de los siguientes: ${metodosValidos.join(', ')}`, undefined];
        }

        let parsedFecha: Date | undefined;
        if (fecha) {
            parsedFecha = new Date(fecha);
            if (parsedFecha.toString() === 'Invalid Date') {
                return ['La fecha debe ser valida', undefined];
            }
        }

        return [undefined, new CreateAbonoDto(
            parsedCuentaId,
            parsedMonto,
            metodopago.toLowerCase(),
            parsedFecha
        )];
    }
}
