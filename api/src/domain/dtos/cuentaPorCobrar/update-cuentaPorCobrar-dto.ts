export class UpdateCuentaPorCobrarDto {

    private constructor(
        public readonly id: number,
        public readonly fechavencimiento?: Date,
        public readonly estado?: string,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.fechavencimiento) returnObj.fechavencimiento = this.fechavencimiento;
        if (this.estado) returnObj.estado = this.estado;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCuentaPorCobrarDto?] {
        const { id, fechavencimiento, estado } = props;

        if (!id || isNaN(Number(id))) return ['El id debe ser un numero valido', undefined];

        let parsedFechaVencimiento: Date | undefined;
        if (fechavencimiento) {
            parsedFechaVencimiento = new Date(fechavencimiento);
            if (parsedFechaVencimiento.toString() === 'Invalid Date') {
                return ['La fecha de vencimiento debe ser una fecha valida', undefined];
            }
        }

        return [undefined, new UpdateCuentaPorCobrarDto(
            Number(id),
            parsedFechaVencimiento,
            estado,
        )];
    }
}
