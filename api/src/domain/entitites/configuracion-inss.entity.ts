export class ConfiguracionInssEntity {

    constructor(
        public readonly id: number,
        public readonly tasalaboral: number,
        public readonly tasapatronal: number,
        public readonly fechavigencia: Date,
        public readonly fechafinvigencia?: Date | null,
        public readonly activo: boolean = true,
        public readonly observaciones?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): ConfiguracionInssEntity {
        const id = object.id ?? object.configinssid ?? object.inssid;
        const { tasalaboral, tasapatronal, fechavigencia, fechafinvigencia, activo, observaciones } = object;

        if (id == null) throw 'ID es obligatorio';
        if (tasalaboral == null) throw 'Tasa laboral es obligatoria';
        if (tasapatronal == null) throw 'Tasa patronal es obligatoria';
        if (!fechavigencia) throw 'Fecha de vigencia es obligatoria';

        return new ConfiguracionInssEntity(
            Number(id),
            Number(tasalaboral),
            Number(tasapatronal),
            new Date(fechavigencia),
            fechafinvigencia ? new Date(fechafinvigencia) : null,
            activo !== undefined ? Boolean(activo) : true,
            observaciones ?? null
        );
    }
}
