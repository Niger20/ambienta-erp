export class CuotaPrestamoEntity {

    constructor(
        public readonly id: number,
        public readonly prestamoid: number,
        public readonly numerocuota: number,
        public readonly montocuota: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string = 'PENDIENTE',
        public readonly fechapago?: Date | null,
        public readonly detalleid?: number | null,
        public readonly empleadonombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): CuotaPrestamoEntity {
        const id = object.id ?? object.cuotaid;
        const estado = object.estado ?? object.estadocuota ?? 'PENDIENTE';
        const detalleid = object.detalleid ?? object.planilladetalleid ?? null;
        const { prestamoid, numerocuota, montocuota, fechavencimiento, fechapago } = object;

        if (id == null) throw 'ID es obligatorio';
        if (prestamoid == null) throw 'Préstamo ID es obligatorio';
        if (numerocuota == null) throw 'Número de cuota es obligatorio';
        if (montocuota == null) throw 'Monto de cuota es obligatorio';
        if (!fechavencimiento) throw 'Fecha de vencimiento es obligatoria';

        const empleadonombre = object.prestamosempleados?.empleados
            ? `${object.prestamosempleados.empleados.nombre} ${object.prestamosempleados.empleados.apellidos}`
            : (object.empleadonombre ?? null);

        return new CuotaPrestamoEntity(
            Number(id),
            Number(prestamoid),
            Number(numerocuota),
            Number(montocuota),
            new Date(fechavencimiento),
            estado,
            fechapago ? new Date(fechapago) : null,
            detalleid != null ? Number(detalleid) : null,
            empleadonombre
        );
    }
}
