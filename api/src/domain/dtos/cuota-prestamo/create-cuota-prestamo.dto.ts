export class CreateCuotaPrestamoDto {

    private constructor(
        public readonly prestamoid: number,
        public readonly numerocuota: number,
        public readonly montocuota: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string = 'PENDIENTE',
        public readonly fechapago?: Date | null,
        public readonly detalleid?: number | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateCuotaPrestamoDto?] {
        const { prestamoid, numerocuota, montocuota, fechavencimiento, estado, estadocuota, fechapago, detalleid, planilladetalleid } = props;

        if (prestamoid == null) return ['El préstamo ID es obligatorio', undefined];
        const parsedPrestamoId = Number(prestamoid);
        if (Number.isNaN(parsedPrestamoId) || !Number.isInteger(parsedPrestamoId)) {
            return ['El préstamo ID debe ser un número entero válido', undefined];
        }

        if (numerocuota == null) return ['El número de cuota es obligatorio', undefined];
        const parsedCuota = Number(numerocuota);
        if (Number.isNaN(parsedCuota) || !Number.isInteger(parsedCuota) || parsedCuota <= 0) {
            return ['El número de cuota debe ser un entero mayor a cero', undefined];
        }

        if (montocuota == null) return ['El monto de la cuota es obligatorio', undefined];
        const parsedMonto = Number(montocuota);
        if (Number.isNaN(parsedMonto) || parsedMonto <= 0) return ['El monto de la cuota debe ser mayor a cero', undefined];

        if (!fechavencimiento) return ['La fecha de vencimiento es obligatoria', undefined];
        const parsedVencimiento = new Date(fechavencimiento);
        if (isNaN(parsedVencimiento.getTime())) return ['La fecha de vencimiento es inválida', undefined];

        let parsedPago: Date | null = null;
        if (fechapago) {
            const d = new Date(fechapago);
            if (!isNaN(d.getTime())) parsedPago = d;
        }

        const parsedDetalleId = (detalleid ?? planilladetalleid) != null ? Number(detalleid ?? planilladetalleid) : null;
        const currentEstado = estado ?? estadocuota ?? 'PENDIENTE';

        return [
            undefined,
            new CreateCuotaPrestamoDto(
                parsedPrestamoId,
                parsedCuota,
                parsedMonto,
                parsedVencimiento,
                String(currentEstado).trim().toUpperCase(),
                parsedPago,
                parsedDetalleId
            )
        ];
    }
}
