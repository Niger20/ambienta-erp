export class UpdateCategoriaClienteDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly descripcion?: string | null,
        public readonly porcentajedescuento?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.descripcion !== undefined) returnObj.descripcion = this.descripcion;
        if (this.porcentajedescuento != null) returnObj.porcentajedescuento = this.porcentajedescuento;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCategoriaClienteDto?] {
        const { id, nombre, descripcion, porcentajedescuento } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        let parsedDescuento: number | undefined;
        if (porcentajedescuento != null) {
            const parsed = Number(porcentajedescuento);
            if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
                return ['El porcentaje de descuento debe ser un número entre 0 y 100', undefined];
            }
            parsedDescuento = parsed;
        }

        return [
            undefined,
            new UpdateCategoriaClienteDto(
                parsedId,
                nombre?.trim(),
                descripcion !== undefined ? (descripcion ? String(descripcion).trim() : null) : undefined,
                parsedDescuento
            )
        ];
    }
}
