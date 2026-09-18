export class FeriadoNacionalEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly fecha: Date,
        public readonly esrecurrente: boolean = true,
        public readonly activo: boolean = true,
    ) {}

    public static fromObject(object: { [key: string]: any }): FeriadoNacionalEntity {
        const id = object.id ?? object.feriadoid;
        const nombre = object.nombre ?? object.descripcion;
        const { fecha, esrecurrente, activo } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'El nombre del feriado es obligatorio';
        if (!fecha) throw 'La fecha del feriado es obligatoria';

        return new FeriadoNacionalEntity(
            Number(id),
            nombre,
            new Date(fecha),
            esrecurrente !== undefined ? Boolean(esrecurrente) : true,
            activo !== undefined ? Boolean(activo) : true
        );
    }
}
