export class CuentaPorCobrarEntity {

    constructor(
        public readonly id: number,
        public readonly ventaid: number,
        public readonly clienteid: number,
        public readonly montototal: number,
        public readonly fechavencimiento: Date,
        public readonly estado: string,
        public readonly montopagado?: number | null,
        public readonly montorestante?: number | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): CuentaPorCobrarEntity {
        const id = object.id ?? object.cuentaid;
        const {
            ventaid,
            clienteid,
            montototal,
            montopagado,
            montorestante,
            fechavencimiento,
            estado,
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (ventaid == null) throw 'Venta ID es obligatorio';
        if (clienteid == null) throw 'Cliente ID es obligatorio';
        if (montototal == null) throw 'Monto total es obligatorio';
        if (!fechavencimiento) throw 'Fecha de vencimiento es obligatoria';
        if (!estado) throw 'Estado es obligatorio';

        return new CuentaPorCobrarEntity(
            Number(id),
            Number(ventaid),
            Number(clienteid),
            Number(montototal),
            new Date(fechavencimiento),
            estado,
            montopagado != null ? Number(montopagado) : null,
            montorestante != null ? Number(montorestante) : null,
        );
    }
}
