export class UpdateOrdenCompraDto {

    private constructor(
        public readonly id: number,
        public readonly proveedorid?: number,
        public readonly estado?: string,
        public readonly fechaorden?: Date | null,
        public readonly fechaesperada?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.proveedorid != null) returnObj.proveedorid = this.proveedorid;
        if (this.estado != null) returnObj.estado = this.estado;
        if (this.fechaorden !== undefined) returnObj.fechaorden = this.fechaorden;
        if (this.fechaesperada !== undefined) returnObj.fechaesperada = this.fechaesperada;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateOrdenCompraDto?] {
        const { id, proveedorid, estado, fechaorden, fechaesperada } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedProveedorId: number | undefined;
        if (proveedorid != null) {
            const parsed = Number(proveedorid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El proveedor ID debe ser un número entero válido', undefined];
            }
            parsedProveedorId = parsed;
        }

        let parsedFechaOrden: Date | null | undefined;
        if (fechaorden !== undefined) {
            if (fechaorden === null) {
                parsedFechaOrden = null;
            } else {
                const d = new Date(fechaorden);
                if (isNaN(d.getTime())) return ['La fecha de orden es inválida', undefined];
                parsedFechaOrden = d;
            }
        }

        let parsedFechaEsperada: Date | null | undefined;
        if (fechaesperada !== undefined) {
            if (fechaesperada === null) {
                parsedFechaEsperada = null;
            } else {
                const d = new Date(fechaesperada);
                if (isNaN(d.getTime())) return ['La fecha esperada es inválida', undefined];
                parsedFechaEsperada = d;
            }
        }

        return [
            undefined,
            new UpdateOrdenCompraDto(
                parsedId,
                parsedProveedorId,
                estado ? String(estado).trim().toUpperCase() : undefined,
                parsedFechaOrden,
                parsedFechaEsperada
            )
        ];
    }
}
