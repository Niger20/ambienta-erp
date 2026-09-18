export class TablaTramoIrEntity {

    constructor(
        public readonly id: number,
        public readonly salariodesde: number,
        public readonly salariohasta: number | null,
        public readonly cuotafija: number,
        public readonly tasamarginal: number,
        public readonly fechavigencia: Date,
        public readonly activo: boolean = true,
    ) {}

    public static fromObject(object: { [key: string]: any }): TablaTramoIrEntity {
        const id = object.id ?? object.tramoirid ?? object.tramoid;
        const { salariodesde, salariohasta, cuotafija, tasamarginal, fechavigencia, activo } = object;

        if (id == null) throw 'ID es obligatorio';
        if (salariodesde == null) throw 'Salario desde es obligatorio';
        if (!fechavigencia) throw 'Fecha de vigencia es obligatoria';

        return new TablaTramoIrEntity(
            Number(id),
            Number(salariodesde),
            salariohasta != null ? Number(salariohasta) : null,
            cuotafija != null ? Number(cuotafija) : 0,
            tasamarginal != null ? Number(tasamarginal) : 0,
            new Date(fechavigencia),
            activo !== undefined ? Boolean(activo) : true
        );
    }
}
