export class UpdateOrdenCompraProductoDto {

    private constructor(
        public readonly ordencompraid: number,
        public readonly productoid: number,
        public readonly cantidadordenada?: number,
        public readonly preciounitario?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.cantidadordenada != null) returnObj.cantidadordenada = this.cantidadordenada;
        if (this.preciounitario != null) returnObj.preciounitario = this.preciounitario;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateOrdenCompraProductoDto?] {
        const { ordencompraid, productoid, cantidadordenada, preciounitario } = props;

        const parsedOrdenCompraId = Number(ordencompraid);
        if (ordencompraid == null || Number.isNaN(parsedOrdenCompraId)) {
            return ['La orden de compra ID es obligatoria y debe ser un número válido', undefined];
        }

        const parsedProductoId = Number(productoid);
        if (productoid == null || Number.isNaN(parsedProductoId)) {
            return ['El producto ID es obligatorio y debe ser un número válido', undefined];
        }

        let parsedCantidad: number | undefined;
        if (cantidadordenada != null) {
            const parsed = Number(cantidadordenada);
            if (Number.isNaN(parsed) || parsed <= 0) {
                return ['La cantidad ordenada debe ser un número positivo mayor a cero', undefined];
            }
            parsedCantidad = parsed;
        }

        let parsedPrecio: number | undefined;
        if (preciounitario != null) {
            const parsed = Number(preciounitario);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El precio unitario debe ser un número válido', undefined];
            }
            parsedPrecio = parsed;
        }

        return [
            undefined,
            new UpdateOrdenCompraProductoDto(
                parsedOrdenCompraId,
                parsedProductoId,
                parsedCantidad,
                parsedPrecio
            )
        ];
    }
}
