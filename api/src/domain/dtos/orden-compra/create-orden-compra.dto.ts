export class CreateOrdenCompraDto {

    private constructor(
        public readonly proveedorid: number,
        public readonly estado: string = 'PENDIENTE',
        public readonly fechaorden?: Date | null,
        public readonly fechaesperada?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateOrdenCompraDto?] {
        const { proveedorid, estado, fechaorden, fechaesperada } = props;

        if (proveedorid == null) return ['El proveedor ID es obligatorio', undefined];
        const parsedProveedorId = Number(proveedorid);
        if (Number.isNaN(parsedProveedorId) || !Number.isInteger(parsedProveedorId)) {
            return ['El proveedor ID debe ser un número entero válido', undefined];
        }

        let parsedFechaOrden: Date | null = new Date();
        if (fechaorden != null) {
            const d = new Date(fechaorden);
            if (isNaN(d.getTime())) return ['La fecha de orden es inválida', undefined];
            parsedFechaOrden = d;
        }

        let parsedFechaEsperada: Date | null = null;
        if (fechaesperada != null) {
            const d = new Date(fechaesperada);
            if (isNaN(d.getTime())) return ['La fecha esperada es inválida', undefined];
            parsedFechaEsperada = d;
        }

        return [
            undefined,
            new CreateOrdenCompraDto(
                parsedProveedorId,
                estado ? String(estado).trim().toUpperCase() : 'PENDIENTE',
                parsedFechaOrden,
                parsedFechaEsperada
            )
        ];
    }
}
