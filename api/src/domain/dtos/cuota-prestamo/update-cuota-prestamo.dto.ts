export class UpdateCuotaPrestamoDto {

    private constructor(
        public readonly id: number,
        public readonly prestamoid?: number,
        public readonly numerocuota?: number,
        public readonly montocuota?: number,
        public readonly fechavencimiento?: Date,
        public readonly estado?: string,
        public readonly fechapago?: Date | null,
        public readonly detalleid?: number | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.prestamoid != null) returnObj.prestamoid = this.prestamoid;
        if (this.numerocuota != null) returnObj.numerocuota = this.numerocuota;
        if (this.montocuota != null) returnObj.montocuota = this.montocuota;
        if (this.fechavencimiento !== undefined) returnObj.fechavencimiento = this.fechavencimiento;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fechapago !== undefined) returnObj.fechapago = this.fechapago;
        if (this.detalleid !== undefined) returnObj.detalleid = this.detalleid;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCuotaPrestamoDto?] {
        const { id, prestamoid, numerocuota, montocuota, fechavencimiento, estado, estadocuota, fechapago, detalleid, planilladetalleid } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedVencimiento: Date | undefined;
        if (fechavencimiento !== undefined) {
            const d = new Date(fechavencimiento);
            if (isNaN(d.getTime())) return ['La fecha de vencimiento es inválida', undefined];
            parsedVencimiento = d;
        }

        let parsedPago: Date | null | undefined;
        if (fechapago !== undefined) {
            if (fechapago === null) {
                parsedPago = null;
            } else {
                const d = new Date(fechapago);
                if (!isNaN(d.getTime())) parsedPago = d;
            }
        }

        const parsedDetalleId = (detalleid ?? planilladetalleid) !== undefined
            ? ((detalleid ?? planilladetalleid) != null ? Number(detalleid ?? planilladetalleid) : null)
            : undefined;

        const currentEstado = estado ?? estadocuota;

        return [
            undefined,
            new UpdateCuotaPrestamoDto(
                parsedId,
                prestamoid != null ? Number(prestamoid) : undefined,
                numerocuota != null ? Number(numerocuota) : undefined,
                montocuota != null ? Number(montocuota) : undefined,
                parsedVencimiento,
                currentEstado ? String(currentEstado).trim().toUpperCase() : undefined,
                parsedPago,
                parsedDetalleId
            )
        ];
    }
}
