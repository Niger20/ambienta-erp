export class EmpresaEntity {

    constructor(
        public readonly id: number,
        public readonly nombreempresa?: string | null,
        public readonly direccion?: string | null,
        public readonly telefono?: string | null,
        public readonly ruc?: string | null,
        public readonly tasacambio?: number | null,
    ) { }

    get isNombreEmpresaAvailable() {
        return !!this.nombreempresa;
    }

    get isDireccionAvailable() {
        return !!this.direccion;
    }

    get isTelefonoAvailable() {
        return !!this.telefono;
    }

    get isRucAvailable() {
        return !!this.ruc;
    }

    public static fromObject(object: { [key: string]: any }): EmpresaEntity {
        const id = object.id ?? object.empresaid;
        const { nombreempresa, direccion, telefono, ruc, tasacambio } = object;

        if (id == null) throw 'ID is required';

        return new EmpresaEntity(
            Number(id),
            nombreempresa,
            direccion,
            telefono,
            ruc,
            tasacambio != null ? Number(tasacambio) : null,
        );
    }
}
