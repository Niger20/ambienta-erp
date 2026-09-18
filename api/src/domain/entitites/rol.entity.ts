export class RolEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion: string | null,
        public readonly essistema: boolean,
        public readonly fechacreacion?: Date | null,
        public readonly permisos?: string[],
    ) {}

    public static fromObject(object: { [key: string]: any }): RolEntity {
        const id = object.id ?? object.rolid;
        const { nombre, descripcion, essistema, fechacreacion } = object;

        if (id == null) throw 'ID is required';
        if (!nombre) throw 'Nombre is required';

        const permisos: string[] | undefined = Array.isArray(object.rolespermisos)
            ? object.rolespermisos.map((rp: any) => rp.permisos?.codigo).filter(Boolean)
            : undefined;

        return new RolEntity(
            Number(id),
            nombre,
            descripcion ?? null,
            !!essistema,
            fechacreacion ? new Date(fechacreacion) : null,
            permisos,
        );
    }
}
