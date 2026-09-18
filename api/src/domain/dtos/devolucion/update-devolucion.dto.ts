export class UpdateDevolucionDto {

    private constructor(
        public readonly id: number,
        public readonly ventaid?: number,
        public readonly productoid?: number,
        public readonly cantidad?: number,
        public readonly motivo?: string,
        public readonly montodevuelto?: number,
        public readonly usuarioid?: number,
        public readonly fecha?: Date | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.ventaid != null) returnObj.ventaid = this.ventaid;
        if (this.productoid != null) returnObj.productoid = this.productoid;
        if (this.cantidad != null) returnObj.cantidad = this.cantidad;
        if (this.motivo != null) returnObj.motivo = this.motivo;
        if (this.montodevuelto != null) returnObj.montodevuelto = this.montodevuelto;
        if (this.usuarioid != null) returnObj.usuarioid = this.usuarioid;
        if (this.fecha !== undefined) returnObj.fecha = this.fecha;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateDevolucionDto?] {
        const { id, ventaid, productoid, cantidad, motivo, montodevuelto, usuarioid, fecha } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedVentaId: number | undefined;
        if (ventaid != null) {
            const parsed = Number(ventaid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['La venta ID debe ser un número entero válido', undefined];
            }
            parsedVentaId = parsed;
        }

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

        if (motivo != null && typeof motivo !== 'string') return ['El motivo debe ser una cadena de texto', undefined];

        let parsedMonto: number | undefined;
        if (montodevuelto != null) {
            const parsed = Number(montodevuelto);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El monto devuelto debe ser un número positivo válido', undefined];
            }
            parsedMonto = parsed;
        }

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

        return [
            undefined,
            new UpdateDevolucionDto(
                parsedId,
                parsedVentaId,
                parsedProductoId,
                parsedCantidad,
                motivo?.trim(),
                parsedMonto,
                parsedUsuarioId,
                parsedFecha
            )
        ];
    }
}
