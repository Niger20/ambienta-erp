export class UpdateTablaTramoIrDto {

    private constructor(
        public readonly id: number,
        public readonly salariodesde?: number,
        public readonly salariohasta?: number | null,
        public readonly cuotafija?: number,
        public readonly tasamarginal?: number,
        public readonly fechavigencia?: Date,
        public readonly activo?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.salariodesde != null) returnObj.salariodesde = this.salariodesde;
        if (this.salariohasta !== undefined) returnObj.salariohasta = this.salariohasta;
        if (this.cuotafija != null) returnObj.cuotafija = this.cuotafija;
        if (this.tasamarginal != null) returnObj.tasamarginal = this.tasamarginal;
        if (this.fechavigencia !== undefined) returnObj.fechavigencia = this.fechavigencia;
        if (this.activo !== undefined) returnObj.activo = this.activo;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateTablaTramoIrDto?] {
        const { id, salariodesde, salariohasta, cuotafija, tasamarginal, fechavigencia, activo } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedVigencia: Date | undefined;
        if (fechavigencia !== undefined) {
            const d = new Date(fechavigencia);
            if (isNaN(d.getTime())) return ['La fecha de vigencia es inválida', undefined];
            parsedVigencia = d;
        }

        let parsedHasta: number | null | undefined;
        if (salariohasta !== undefined) {
            if (salariohasta === null) {
                parsedHasta = null;
            } else {
                const parsed = Number(salariohasta);
                if (Number.isNaN(parsed)) return ['El salario hasta debe ser un número válido', undefined];
                parsedHasta = parsed;
            }
        }

        return [
            undefined,
            new UpdateTablaTramoIrDto(
                parsedId,
                salariodesde != null ? Number(salariodesde) : undefined,
                parsedHasta,
                cuotafija != null ? Number(cuotafija) : undefined,
                tasamarginal != null ? Number(tasamarginal) : undefined,
                parsedVigencia,
                activo !== undefined ? Boolean(activo) : undefined
            )
        ];
    }
}
