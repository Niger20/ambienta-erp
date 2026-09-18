export class VentaEntity {

    constructor(
        public readonly id: number,
        public readonly sesionid: number,
        public readonly total: number,
        public readonly metodopago: string,
        public readonly tipoventa: string,
        public readonly lugarventa: string,
        public readonly estado: boolean,
        public readonly clienteid?: number | null,
        public readonly clientenombre?: string | null,
        public readonly clientetelefono?: string | null,
        public readonly fecha?: Date | null,
        public readonly tipofactura?: string | null,
        public readonly consecutivofiscal?: string | null,
        public readonly consecutivonofiscal?: string | null,
        public readonly descuentofactura?: number | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): VentaEntity {
        const id = object.id ?? object.ventaid;
        const {
            sesionid,
            total,
            tipoventa,
            lugarventa,
            estado,
            clienteid,
            fecha,
            tipofactura,
            consecutivofiscal,
            consecutivonofiscal,
            descuentofactura,
        } = object;

        const clientenombre =
            object.clientenombre ??
            object.clientes?.nombre ??
            object.cliente?.nombre ??
            null;

        const clientetelefono =
            object.clientetelefono ??
            object.clientes?.telefono ??
            object.cliente?.telefono ??
            null;

        const metodopago = object.metodopago ?? object.tipoventa ?? 'EFECTIVO';

        if (id == null) throw 'ID es obligatorio';
        if (sesionid == null) throw 'Sesion ID es obligatorio';
        if (total == null) throw 'Total es obligatorio';
        if (!tipoventa) throw 'Tipo de venta es obligatorio';
        if (!lugarventa) throw 'Lugar de venta es obligatorio';

        return new VentaEntity(
            Number(id),
            Number(sesionid),
            Number(total),
            metodopago,
            tipoventa,
            lugarventa,
            estado ?? true,
            clienteid != null ? Number(clienteid) : null,
            clientenombre,
            clientetelefono,
            fecha ? new Date(fecha) : null,
            tipofactura ?? null,
            consecutivofiscal ?? null,
            consecutivonofiscal ?? null,
            descuentofactura != null ? Number(descuentofactura) : 0,
        );
    }
}
