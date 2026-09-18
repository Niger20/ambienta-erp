export class CuentaPorPagarEntity {

    constructor(
        public readonly id: number,
        public readonly compraid: number,
        public readonly montototal: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string,
        public readonly montopagado?: number | null,
        public readonly montorestante?: number | null,
        public readonly cuotas?: number | null,
        public readonly montocuota?: number | null,
        public readonly fechacuota?: number | null,
        public readonly compras?: any,  // joined compra with proveedores
    ) { }

    public static fromObject(object: { [key: string]: any }): CuentaPorPagarEntity {
        const id = object.id ?? object.cuentapagarid;
        const {
            compraid,
            montototal,
            montopagado,
            montorestante,
            cuotas,
            montocuota,
            fechacuota,
            fechavencimiento,
            estado,
            compras,
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (compraid == null) throw 'Compra ID es obligatorio';
        if (montototal == null) throw 'Monto total es obligatorio';
        if (!fechavencimiento) throw 'Fecha de vencimiento es obligatoria';
        if (!estado) throw 'Estado es obligatorio';

        return new CuentaPorPagarEntity(
            Number(id),
            Number(compraid),
            Number(montototal),
            new Date(fechavencimiento),
            estado,
            montopagado != null ? Number(montopagado) : null,
            montorestante != null ? Number(montorestante) : null,
            cuotas != null ? Number(cuotas) : null,
            montocuota != null ? Number(montocuota) : null,
            fechacuota != null ? Number(fechacuota) : null,
            compras ?? null,
        );
    }
}
