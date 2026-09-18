export class UpdateCuentaPorPagarDto {

    private constructor(
        public readonly id: number,
        public readonly fechavencimiento?: Date,
        public readonly estado?: string,
        public readonly cuotas?: number | null,
        public readonly fechacuota?: number | null,
        public readonly montopagado?: number | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.fechavencimiento) returnObj.fechavencimiento = this.fechavencimiento;
        if (this.estado) returnObj.estado = this.estado;
        if (this.cuotas !== undefined) returnObj.cuotas = this.cuotas;
        if (this.fechacuota !== undefined) returnObj.fechacuota = this.fechacuota;
        if (this.montopagado !== undefined && this.montopagado !== null) returnObj.montopagado = this.montopagado;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCuentaPorPagarDto?] {
        const { id, fechavencimiento, estado, cuotas, fechacuota, montopagado } = props;

        if (!id || isNaN(Number(id))) return ['El id debe ser un numero valido', undefined];

        let parsedFechaVencimiento: Date | undefined;
        if (fechavencimiento) {
            parsedFechaVencimiento = new Date(fechavencimiento);
            if (parsedFechaVencimiento.toString() === 'Invalid Date') {
                return ['La fecha de vencimiento debe ser una fecha valida', undefined];
            }
        }

        let parsedCuotas: number | null | undefined;
        if (cuotas !== undefined) {
            if (cuotas === null) {
                parsedCuotas = null;
            } else {
                const num = Number(cuotas);
                if (Number.isNaN(num) || !Number.isInteger(num)) {
                    return ['Las cuotas deben ser un numero entero valido', undefined];
                }
                parsedCuotas = num;
            }
        }

        let parsedFechaCuota: number | null | undefined;
        if (fechacuota !== undefined) {
            if (fechacuota === null) {
                parsedFechaCuota = null;
            } else {
                const num = Number(fechacuota);
                if (Number.isNaN(num) || !Number.isInteger(num)) {
                    return ['La fecha cuota debe ser un numero entero valido', undefined];
                }
                parsedFechaCuota = num;
            }
        }

        let parsedMontoPagado: number | null | undefined;
        if (montopagado !== undefined && montopagado !== null) {
            const num = Number(montopagado);
            if (!Number.isNaN(num)) {
                parsedMontoPagado = num;
            }
        }

        return [undefined, new UpdateCuentaPorPagarDto(
            Number(id),
            parsedFechaVencimiento,
            estado,
            parsedCuotas,
            parsedFechaCuota,
            parsedMontoPagado,
        )];
    }
}
