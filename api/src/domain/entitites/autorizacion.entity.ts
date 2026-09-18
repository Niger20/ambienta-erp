export class AutorizacionEntity {
    constructor(
        public readonly autorizacionid: number,
        public readonly usuarioid: number,
        public readonly accion: string,
        public readonly detalle: string | null,
        public readonly codigo: string | null,
        public readonly estado: string,
        public readonly fecha: Date | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AutorizacionEntity {
        const {
            autorizacionid,
            usuarioid,
            accion,
            detalle,
            codigo,
            estado,
            fecha,
        } = object;

        if (!autorizacionid) throw 'Missing autorizacionid';
        if (!usuarioid) throw 'Missing usuarioid';
        if (!accion) throw 'Missing accion';
        if (!estado) throw 'Missing estado';

        return new AutorizacionEntity(
            autorizacionid,
            usuarioid,
            accion,
            detalle,
            codigo,
            estado,
            fecha
        );
    }
}
