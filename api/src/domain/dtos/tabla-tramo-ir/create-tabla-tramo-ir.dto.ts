export class CreateTablaTramoIrDto {

    private constructor(
        public readonly salariodesde: number,
        public readonly salariohasta: number | null,
        public readonly cuotafija: number,
        public readonly tasamarginal: number,
        public readonly fechavigencia: Date,
        public readonly activo: boolean = true,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateTablaTramoIrDto?] {
        const { salariodesde, salariohasta, cuotafija, tasamarginal, fechavigencia, activo } = props;

        if (salariodesde == null) return ['El salario desde es obligatorio', undefined];
        const parsedDesde = Number(salariodesde);
        if (Number.isNaN(parsedDesde) || parsedDesde < 0) return ['El salario desde debe ser un número válido', undefined];

        let parsedHasta: number | null = null;
        if (salariohasta != null) {
            const parsed = Number(salariohasta);
            if (Number.isNaN(parsed) || parsed <= parsedDesde) return ['El salario hasta debe ser mayor a salario desde', undefined];
            parsedHasta = parsed;
        }

        const parsedCuota = cuotafija != null ? Number(cuotafija) : 0;
        const parsedTasa = tasamarginal != null ? Number(tasamarginal) : 0;

        let parsedVigencia = new Date();
        if (fechavigencia) {
            const d = new Date(fechavigencia);
            if (isNaN(d.getTime())) return ['La fecha de vigencia es inválida', undefined];
            parsedVigencia = d;
        }

        return [
            undefined,
            new CreateTablaTramoIrDto(
                parsedDesde,
                parsedHasta,
                parsedCuota,
                parsedTasa,
                parsedVigencia,
                activo !== undefined ? Boolean(activo) : true
            )
        ];
    }
}
