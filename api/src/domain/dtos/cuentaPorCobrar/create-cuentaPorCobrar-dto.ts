export class CreateCuentaPorCobrarDto {

    private constructor(
        public readonly ventaid: number,
        public readonly clienteid: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateCuentaPorCobrarDto?] {
        const { ventaid, clienteid, fechavencimiento, estado } = props;

        if (ventaid == null) return ['El venta id es obligatorio', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['El venta id debe ser un numero entero valido', undefined];
        }

        if (clienteid == null) return ['El cliente id es obligatorio', undefined];
        const parsedClienteId = Number(clienteid);
        if (Number.isNaN(parsedClienteId) || !Number.isInteger(parsedClienteId)) {
            return ['El cliente id debe ser un numero entero valido', undefined];
        }

        if (!fechavencimiento) return ['La fecha de vencimiento es obligatoria', undefined];
        const parsedFechaVencimiento = new Date(fechavencimiento);
        if (parsedFechaVencimiento.toString() === 'Invalid Date') {
            return ['La fecha de vencimiento debe ser una fecha valida', undefined];
        }

        if (!estado) return ['El estado es obligatorio', undefined];
        if (typeof estado !== 'string') return ['El estado debe ser una cadena de texto', undefined];


        return [undefined, new CreateCuentaPorCobrarDto(
            parsedVentaId,
            parsedClienteId,
            parsedFechaVencimiento,
            estado,
        )];
    }
}
