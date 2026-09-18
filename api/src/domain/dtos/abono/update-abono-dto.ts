export class UpdateAbonoDto {

    private constructor(
        public readonly id: number,
        public readonly monto?: number,
        public readonly metodopago?: string,
        public readonly fecha?: Date,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.monto !== undefined) returnObj.monto = this.monto;
        if (this.metodopago) returnObj.metodopago = this.metodopago;
        if (this.fecha) returnObj.fecha = this.fecha;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateAbonoDto?] {
        const { id, monto, metodopago, fecha } = props;

        if (!id || isNaN(Number(id))) return ['El id debe ser un numero valido', undefined];

        let parsedMonto: number | undefined;
        if (monto !== undefined) {
            parsedMonto = Number(monto);
            if (Number.isNaN(parsedMonto)) {
                return ['El monto debe ser un numero', undefined];
            }
        }

        if (metodopago != null) {
            if (typeof metodopago !== 'string') return ['El metodo de pago debe ser una cadena de texto', undefined];
            const metodosValidos = ['efectivo', 'bac', 'lafise', 'banpro', 'credito', 'transferencia'];
            if (!metodosValidos.includes(metodopago.toLowerCase())) {
                return [`El metodo de pago debe ser uno de los siguientes: ${metodosValidos.join(', ')}`, undefined];
            }
        }

        let parsedFecha: Date | undefined;
        if (fecha) {
            parsedFecha = new Date(fecha);
            if (parsedFecha.toString() === 'Invalid Date') {
                return ['La fecha debe ser valida', undefined];
            }
        }

        return [undefined, new UpdateAbonoDto(
            Number(id),
            parsedMonto,
            metodopago?.toLowerCase(),
            parsedFecha
        )];
    }
}
