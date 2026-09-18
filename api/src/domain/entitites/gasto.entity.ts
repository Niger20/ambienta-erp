export class GastoEntity {

    constructor(
        public readonly id: number,
        public readonly usuarioid: number,
        public readonly nombre: string,
        public readonly nombreusuario: string,
        public readonly descripcion?: string | null,
    ) { }

    public static fromObject(object: { [key: string]: any }): GastoEntity {
        const id = object.id ?? object.gastoid;
        const { usuarioid, nombre, descripcion } = object;

        const nombreusuario =
            object.nombreusuario ??
            object.usuarios?.nombreusuario ??
            object.usuario?.nombreusuario ??
            null;

        if (id == null) throw 'ID es obligatorio';
        if (usuarioid == null) throw 'Usuario ID es obligatorio';
        if (!nombre) throw 'Nombre es obligatorio';

        return new GastoEntity(
            Number(id),
            Number(usuarioid),
            nombre,
            nombreusuario ?? 'Desconocido',
            descripcion ?? null,
        );
    }
}
