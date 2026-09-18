export class AuditoriaEntity {

    constructor(
        public readonly id: number,
        public readonly tabla: string,
        public readonly operacion: string,
        public readonly usuarioid?: number | null,
        public readonly datosanteriores?: any,
        public readonly datosnuevos?: any,
        public readonly fecha?: Date | null,
        public readonly usuarionombre?: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): AuditoriaEntity {
        const id = object.id ?? object.auditoriaid;
        const { tabla, operacion, usuarioid, datosanteriores, datosnuevos, fecha } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!tabla) throw 'Tabla es obligatoria';
        if (!operacion) throw 'Operación es obligatoria';

        const usuarionombre = object.usuarios?.nombreusuario ?? object.usuarionombre ?? null;

        return new AuditoriaEntity(
            Number(id),
            tabla,
            operacion,
            usuarioid != null ? Number(usuarioid) : null,
            datosanteriores ?? null,
            datosnuevos ?? null,
            fecha ? new Date(fecha) : null,
            usuarionombre
        );
    }
}
