export class CreateOrdenCompraProductoDto {

    private constructor(
        public readonly ordencompraid: number,
        public readonly productoid: number,
        public readonly cantidadordenada: number,
        public readonly preciounitario: number,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateOrdenCompraProductoDto?] {
        const { ordencompraid, productoid, cantidadordenada, preciounitario } = props;

        if (ordencompraid == null) return ['La orden de compra ID es obligatoria', undefined];
        const parsedOrdenCompraId = Number(ordencompraid);
        if (Number.isNaN(parsedOrdenCompraId) || !Number.isInteger(parsedOrdenCompraId)) {
            return ['La orden de compra ID debe ser un número entero válido', undefined];
        }

        if (productoid == null) return ['El producto ID es obligatorio', undefined];
        const parsedProductoId = Number(productoid);
        if (Number.isNaN(parsedProductoId) || !Number.isInteger(parsedProductoId)) {
            return ['El producto ID debe ser un número entero válido', undefined];
        }

        if (cantidadordenada == null) return ['La cantidad ordenada es obligatoria', undefined];
        const parsedCantidad = Number(cantidadordenada);
        if (Number.isNaN(parsedCantidad) || parsedCantidad <= 0) {
            return ['La cantidad ordenada debe ser un número positivo mayor a cero', undefined];
        }

        if (preciounitario == null) return ['El precio unitario es obligatorio', undefined];
        const parsedPrecio = Number(preciounitario);
        if (Number.isNaN(parsedPrecio) || parsedPrecio < 0) {
            return ['El precio unitario debe ser un número válido', undefined];
        }

        return [
            undefined,
            new CreateOrdenCompraProductoDto(
                parsedOrdenCompraId,
                parsedProductoId,
                parsedCantidad,
                parsedPrecio
            )
        ];
    }
}
