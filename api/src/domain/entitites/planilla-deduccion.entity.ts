export class PlanillaDeduccionEntity {

    constructor(
        public readonly id: number,
        public readonly detalleid: number,
        public readonly concepto: string,
        public readonly monto: number,
    ) {}

    public static fromObject(object: { [key: string]: any }): PlanillaDeduccionEntity {
        const id = object.id ?? object.deduccionplanillaid ?? object.deduccionid;
        const detalleid = object.detalleid ?? object.planilladetalleid;
        const concepto = object.concepto ?? object.descripcion;
        const { monto } = object;

        if (id == null) throw 'ID es obligatorio';
        if (detalleid == null) throw 'Planilla detalle ID es obligatorio';
        if (!concepto) throw 'Concepto es obligatorio';
        if (monto == null) throw 'Monto es obligatorio';

        return new PlanillaDeduccionEntity(
            Number(id),
            Number(detalleid),
            concepto,
            Number(monto)
        );
    }
}
