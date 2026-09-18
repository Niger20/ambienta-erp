export class ClienteEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly cedula?: string | null,
        public readonly telefono?: string | null,
        public readonly direccion?: string | null,
        public readonly ubicaciongeografica?: string | null,
        public readonly limitecredito?: number | null,
        public readonly categoriaclienteid?: number | null,
        public readonly tipocliente?: string | null,
        public readonly ruc?: string | null,
    ) {}

    get isCedulaAvailable() {
        return !!this.cedula;
    }

    get isTelefonoAvailable() {
        return !!this.telefono;
    }

    get isDireccionAvailable() {
        return !!this.direccion;
    }

    get isUbicacionGeograficaAvailable() {
        return !!this.ubicaciongeografica;
    }

    get isLimiteCreditoAvailable() {
        return this.limitecredito != null;
    }

    public static fromObject(object: { [key: string]: any }): ClienteEntity {
        const id = object.id ?? object.clienteid;
        const {
            nombre,
            cedula,
            telefono,
            direccion,
            ubicaciongeografica,
            limitecredito,
            categoriaclienteid,
            tipocliente,
            ruc,
        } = object;

        if (id == null) throw 'ID is required';
        if (!nombre) throw 'Nombre is required';

        return new ClienteEntity(
            Number(id),
            nombre,
            cedula ?? null,
            telefono ?? null,
            direccion ?? null,
            ubicaciongeografica ?? null,
            limitecredito != null ? Number(limitecredito) : null,
            categoriaclienteid != null ? Number(categoriaclienteid) : null,
            tipocliente ?? 'NATURAL',
            ruc ?? null
        );
    }
}
