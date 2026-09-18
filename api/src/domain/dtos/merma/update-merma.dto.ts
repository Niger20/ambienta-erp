export class UpdateMermaDto {

    private constructor(
        public readonly id: number,
        public readonly productoid?: number,
        public readonly cantidad?: number,
        public readonly costounitario?: number,
        public readonly motivo?: string,
        public readonly usuarioid?: number,
        public readonly fecha?: Date | null,
        public readonly movimientoid?: number | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.productoid != null) returnObj.productoid = this.productoid;
        if (this.cantidad != null) returnObj.cantidad = this.cantidad;
        if (this.costounitario != null) returnObj.costounitario = this.costounitario;
        if (this.motivo != null) returnObj.motivo = this.motivo;
        if (this.usuarioid != null) returnObj.usuarioid = this.usuarioid;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        if (this.movimientoid !== undefined) returnObj.movimientoid = this.movimientoid;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateMermaDto?] {
        const { id, productoid, cantidad, costounitario, motivo, usuarioid, fecha, movimientoid } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedProductoId: number | undefined;
        if (productoid != null) {
            const parsed = Number(productoid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El producto ID debe ser un número entero válido', undefined];
            }
            parsedProductoId = parsed;
        }

        let parsedCantidad: number | undefined;
        if (cantidad != null) {
            const parsed = Number(cantidad);
            if (Number.isNaN(parsed) || parsed <= 0) {
                return ['La cantidad debe ser un número positivo mayor a cero', undefined];
            }
            parsedCantidad = parsed;
        }

        let parsedCosto: number | undefined;
        if (costounitario != null) {
            const parsed = Number(costounitario);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El costo unitario debe ser un número válido', undefined];
            }
            parsedCosto = parsed;
        }

        if (motivo != null && typeof motivo !== 'string') return ['El motivo debe ser una cadena de texto', undefined];

        let parsedUsuarioId: number | undefined;
        if (usuarioid != null) {
            const parsed = Number(usuarioid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El usuario ID debe ser un número entero válido', undefined];
            }
            parsedUsuarioId = parsed;
        }

        let parsedFecha: Date | null | undefined;
        if (fecha !== undefined) {
            if (fecha === null) {
                parsedFecha = null;
            } else {
                const d = new Date(fecha);
                if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
                parsedFecha = d;
            }
        }

        let parsedMovimientoId: number | null | undefined;
        if (movimientoid !== undefined) {
            if (movimientoid === null) {
                parsedMovimientoId = null;
            } else {
                const parsed = Number(movimientoid);
                if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                    return ['El movimiento ID debe ser un número entero válido', undefined];
                }
                parsedMovimientoId = parsed;
            }
        }

        return [
            undefined,
            new UpdateMermaDto(
                parsedId,
                parsedProductoId,
                parsedCantidad,
                parsedCosto,
                motivo?.trim(),
                parsedUsuarioId,
                parsedFecha,
                parsedMovimientoId
            )
        ];
    }
}
