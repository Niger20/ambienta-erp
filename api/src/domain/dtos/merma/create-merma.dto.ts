export class CreateMermaDto {

    private constructor(
        public readonly productoid: number,
        public readonly cantidad: number,
        public readonly costounitario: number,
        public readonly motivo: string,
        public readonly usuarioid: number,
        public readonly fecha?: Date | null,
        public readonly movimientoid?: number | null,
        public readonly productodestinoid?: number | null,
        public readonly cantidaddestino?: number | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateMermaDto?] {
        const { productoid, cantidad, costounitario, motivo, usuarioid, fecha, movimientoid, productodestinoid, cantidaddestino } = props;

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

        if (costounitario == null) return ['El costo unitario es obligatorio', undefined];
        const parsedCosto = Number(costounitario);
        if (Number.isNaN(parsedCosto) || parsedCosto < 0) {
            return ['El costo unitario debe ser un número válido', undefined];
        }

        if (!motivo) return ['El motivo es obligatorio', undefined];
        if (typeof motivo !== 'string') return ['El motivo debe ser una cadena de texto', undefined];

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

        let parsedMovimientoId: number | null = null;
        if (movimientoid != null) {
            const parsed = Number(movimientoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El movimiento ID debe ser un número entero válido', undefined];
            }
            parsedMovimientoId = parsed;
        }

        let parsedProductoDestinoId: number | null = null;
        if (productodestinoid != null) {
            const parsed = Number(productodestinoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El producto destino ID debe ser un número entero válido', undefined];
            }
            if (parsed === parsedProductoId) {
                return ['El producto destino debe ser distinto al producto de la merma', undefined];
            }
            parsedProductoDestinoId = parsed;
        }

        let parsedCantidadDestino: number | null = null;
        if (parsedProductoDestinoId != null) {
            const rawCantidadDestino = cantidaddestino != null ? cantidaddestino : cantidad;
            const parsed = Number(rawCantidadDestino);
            if (Number.isNaN(parsed) || parsed <= 0) {
                return ['La cantidad destino debe ser un número positivo mayor a cero', undefined];
            }
            parsedCantidadDestino = parsed;
        }

        return [
            undefined,
            new CreateMermaDto(
                parsedProductoId,
                parsedCantidad,
                parsedCosto,
                motivo.trim(),
                parsedUsuarioId,
                parsedFecha,
                parsedMovimientoId,
                parsedProductoDestinoId,
                parsedCantidadDestino
            )
        ];
    }
}
