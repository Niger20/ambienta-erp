export class CompraEntity {

    constructor(
        public readonly id: number,
        public readonly proveedorid: number,
        public readonly total: number,
        public readonly metodopago: string,
        public readonly tipocompra: string,
        public readonly estado: boolean,
        public readonly facturaproveedor?: string | null,
        public readonly fecha?: Date | null,
        public readonly proveedores?: any,  // joined proveedor data
    ) { }

    public static fromObject(object: { [key: string]: any }): CompraEntity {
        const id = object.id ?? object.compraid;
        const {
            proveedorid,
            total,
            metodopago,
            tipocompra,
            estado,
            facturaproveedor,
            fecha,
            proveedores,
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (proveedorid == null) throw 'Proveedor ID es obligatorio';
        if (total == null) throw 'Total es obligatorio';
        if (!metodopago) throw 'Metodo de pago es obligatorio';
        if (!tipocompra) throw 'Tipo de compra es obligatorio';

        return new CompraEntity(
            Number(id),
            Number(proveedorid),
            Number(total),
            metodopago,
            tipocompra,
            estado ?? true,
            facturaproveedor ?? null,
            fecha ? new Date(fecha) : null,
            proveedores ?? null,
        );
    }
}
