export class CreateDevolucionDto {

    private constructor(
        public readonly ventaid: number,
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly motivo: string,
        public readonly montodevuelto: number,
        public readonly usuarioid: number,
        public readonly fecha?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateDevolucionDto?] {
        const { ventaid, productoid, cantidad, motivo, montodevuelto, usuarioid, fecha } = props;

        if (ventaid == null) return ['La venta ID es obligatoria', undefined];
        const parsedVentaId = Number(ventaid);
        if (Number.isNaN(parsedVentaId) || !Number.isInteger(parsedVentaId)) {
            return ['La venta ID debe ser un número entero válido', undefined];
        }

        if (productoid == null) return ['El producto ID es obligatorio', undefined];
        const parsedProductoId = Number(productoid);
        if (Number.isNaN(parsedProductoId) || !Number.isInteger(parsedProductoId)) {
            return ['El producto ID debe ser un número entero válido', undefined];
        }

        if (cantidad == null) return ['La cantidad es obligatoria', undefined];
        const parsedCantidad = Number(cantidad);
        if (Number.isNaN(parsedCantidad) || parsedCantidad <= 0) {
            return ['La cantidad debe ser un número positivo mayor a cero', undefined];
        }

        if (!motivo) return ['El motivo es obligatorio', undefined];
        if (typeof motivo !== 'string') return ['El motivo debe ser una cadena de texto', undefined];

        if (montodevuelto == null) return ['El monto devuelto es obligatorio', undefined];
        const parsedMonto = Number(montodevuelto);
        if (Number.isNaN(parsedMonto) || parsedMonto < 0) {
            return ['El monto devuelto debe ser un número positivo válido', undefined];
        }

        if (usuarioid == null) return ['El usuario ID es obligatorio', undefined];
        const parsedUsuarioId = Number(usuarioid);
        if (Number.isNaN(parsedUsuarioId) || !Number.isInteger(parsedUsuarioId)) {
            return ['El usuario ID debe ser un número entero válido', undefined];
        }

        let parsedFecha: Date | null = new Date();
        if (fecha != null) {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new CreateDevolucionDto(
                parsedVentaId,
                parsedProductoId,
                parsedCantidad,
                motivo.trim(),
                parsedMonto,
                parsedUsuarioId,
                parsedFecha
            )
        ];
    }
}
