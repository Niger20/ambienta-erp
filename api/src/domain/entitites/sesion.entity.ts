export class SesionEntity {

    constructor(
        public readonly id: number,
        public readonly usuarioid: number,
        public readonly montoinicial: number,
        public readonly nombreusuario: string,
        public readonly fechainicio?: Date | null,
        public readonly fechafin?: Date | null,
        public readonly montofinalsistema?: number | null,
        public readonly montofinalfisico?: number | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): SesionEntity {
        const id = object.id ?? object.sesionid;
        const {
            usuarioid,
            montoinicial,
            fechainicio,
            fechafin,
            montofinalsistema,
            montofinalfisico,
        } = object;

        const nombreusuario =
            object.nombreusuario ??
            object.usuarios?.nombreusuario ??
            object.usuario?.nombreusuario ??
            null;

        if (id == null) throw 'ID es obligatorio';
        if (usuarioid == null) throw 'Usuario ID es obligatorio';
        if (montoinicial == null) throw 'Monto inicial es obligatorio';

        return new SesionEntity(
            Number(id),
            Number(usuarioid),
            Number(montoinicial),
            nombreusuario ?? 'Desconocido',
            fechainicio ? new Date(fechainicio) : null,
            fechafin ? new Date(fechafin) : null,
            montofinalsistema != null ? Number(montofinalsistema) : null,
            montofinalfisico != null ? Number(montofinalfisico) : null,
        );
    }
}
