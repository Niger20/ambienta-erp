export class PeriodoPlanillaEntity {

    constructor(
        public readonly id: number,
        public readonly fechainicio: Date,
        public readonly fechafin: Date,
        public readonly tipoperiodo: string = 'MENSUAL',
        public readonly fechapago?: Date | null,
        public readonly estado: string = 'ABIERTO',
        public readonly observaciones?: string | null,
        public readonly usuarioaprobacionid?: number | null,
        public readonly fechaaprobacion?: Date | null,
        public readonly detalles?: any[],
    ) {}

    public static fromObject(object: { [key: string]: any }): PeriodoPlanillaEntity {
        const id = object.id ?? object.periodoid;
        const tipoperiodo = object.tipoperiodo ?? object.nombre ?? 'MENSUAL';
        const {
            fechainicio,
            fechafin,
            fechapago,
            estado,
            observaciones,
            usuarioaprobacionid,
            fechaaprobacion,
            planilladetalle
        } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!fechainicio) throw 'La fecha de inicio es obligatoria';
        if (!fechafin) throw 'La fecha de fin es obligatoria';

        return new PeriodoPlanillaEntity(
            Number(id),
            new Date(fechainicio),
            new Date(fechafin),
            tipoperiodo,
            fechapago ? new Date(fechapago) : null,
            estado || 'ABIERTO',
            observaciones ?? null,
            usuarioaprobacionid != null ? Number(usuarioaprobacionid) : null,
            fechaaprobacion ? new Date(fechaaprobacion) : null,
            planilladetalle
        );
    }
}
