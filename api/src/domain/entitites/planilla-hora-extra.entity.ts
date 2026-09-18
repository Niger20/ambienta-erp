export class PlanillaHoraExtraEntity {

    constructor(
        public readonly id: number,
        public readonly detalleid: number,
        public readonly fecha: Date,
        public readonly tipohora: string,
        public readonly horastrabajadas: number,
        public readonly tarifahora: number,
        public readonly porcentajerecargo: number,
        public readonly montohoraextra?: number | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): PlanillaHoraExtraEntity {
        const id = object.id ?? object.horasextraid ?? object.horaextraid;
        const detalleid = object.detalleid ?? object.planilladetalleid;
        const tipohora = object.tipohora ?? 'EXTRA_DIURNA';
        const horastrabajadas = object.horastrabajadas ?? object.numerohoras ?? 0;
        const tarifahora = object.tarifahora ?? object.montopagar ?? 0;
        const porcentajerecargo = object.porcentajerecargo ?? (object.factor ? Number(object.factor) * 100 : 200);
        const montohoraextra = object.montohoraextra ?? (Number(horastrabajadas) * Number(tarifahora) * (Number(porcentajerecargo) / 100));
        const { fecha } = object;

        if (id == null) throw 'ID es obligatorio';
        if (detalleid == null) throw 'Planilla detalle ID es obligatorio';
        if (!fecha) throw 'Fecha es obligatoria';

        return new PlanillaHoraExtraEntity(
            Number(id),
            Number(detalleid),
            new Date(fecha),
            tipohora,
            Number(horastrabajadas),
            Number(tarifahora),
            Number(porcentajerecargo),
            Number(montohoraextra)
        );
    }
}
