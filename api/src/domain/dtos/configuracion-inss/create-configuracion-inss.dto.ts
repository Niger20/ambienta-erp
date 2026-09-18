export class CreateConfiguracionInssDto {

    private constructor(
        public readonly tasalaboral: number,
        public readonly tasapatronal: number,
        public readonly fechavigencia: Date,
        public readonly fechafinvigencia?: Date | null,
        public readonly activo: boolean = true,
        public readonly observaciones?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateConfiguracionInssDto?] {
        const { tasalaboral, tasapatronal, fechavigencia, fechafinvigencia, activo, observaciones } = props;

        if (tasalaboral == null) return ['La tasa laboral es obligatoria', undefined];
        const parsedLaboral = Number(tasalaboral);
        if (Number.isNaN(parsedLaboral) || parsedLaboral < 0) return ['La tasa laboral debe ser un número válido', undefined];

        if (tasapatronal == null) return ['La tasa patronal es obligatoria', undefined];
        const parsedPatronal = Number(tasapatronal);
        if (Number.isNaN(parsedPatronal) || parsedPatronal < 0) return ['La tasa patronal debe ser un número válido', undefined];

        let parsedVigencia = new Date();
        if (fechavigencia) {
            const d = new Date(fechavigencia);
            if (isNaN(d.getTime())) return ['La fecha de vigencia es inválida', undefined];
            parsedVigencia = d;
        }

        let parsedFin: Date | null = null;
        if (fechafinvigencia) {
            const d = new Date(fechafinvigencia);
            if (!isNaN(d.getTime())) parsedFin = d;
        }

        return [
            undefined,
            new CreateConfiguracionInssDto(
                parsedLaboral,
                parsedPatronal,
                parsedVigencia,
                parsedFin,
                activo !== undefined ? Boolean(activo) : true,
                observaciones ? String(observaciones).trim() : null
            )
        ];
    }
}
