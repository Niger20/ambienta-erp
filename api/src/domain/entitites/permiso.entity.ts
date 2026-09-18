export class PermisoEntity {

    constructor(
        public readonly id: number,
        public readonly codigo: string,
        public readonly modulo: string,
        public readonly descripcion: string | null,
    ) {}

    public static fromObject(object: { [key: string]: any }): PermisoEntity {
        const id = object.id ?? object.permisoid;
        const { codigo, modulo, descripcion } = object;

        if (id == null) throw 'ID is required';
        if (!codigo) throw 'Codigo is required';
        if (!modulo) throw 'Modulo is required';

        return new PermisoEntity(Number(id), codigo, modulo, descripcion ?? null);
    }
}
