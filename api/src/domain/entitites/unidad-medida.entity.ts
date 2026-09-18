export class UnidadMedidaEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly abreviatura: string,
        public readonly permitefraccionamiento: boolean = false,
    ) {}

    public static fromObject(object: { [key: string]: any }): UnidadMedidaEntity {
        const id = object.id ?? object.unidadmedidaid;
        const { nombre, abreviatura, permitefraccionamiento } = object;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'El nombre es obligatorio';
        if (!abreviatura) throw 'La abreviatura es obligatoria';

        return new UnidadMedidaEntity(
            Number(id),
            nombre,
            abreviatura,
            Boolean(permitefraccionamiento)
        );
    }
}
