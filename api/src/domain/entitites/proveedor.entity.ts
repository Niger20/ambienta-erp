



export class ProveedorEntity {

    constructor(
        public readonly id: number,
        public readonly nombreempresa: string,
        public readonly asesorventas: string,
        public readonly telefono ?: string|null,
        public readonly direccion ?: string|null,
        public readonly ubicaciongeografica?: string,
        public readonly clasificacion?: string,
    ) {}

    get isTelefonoAvailable(){
        return !!this.telefono;
    }

    get isDireccionAvailable(){
        return !!this.direccion;
    }

    get isUbicacionGeograficaAvailable(){
        return !!this.ubicaciongeografica;
    }

    get isClasificacionAvailable(){
        return !!this.clasificacion;
    }

    public static fromObject ( object: {[key : string]: any} ): ProveedorEntity {
        const id = object.id ?? object.proveedorid;
        const { nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion } = object;

        if (id == null) throw 'ID is required';
        if (!nombreempresa) throw 'Nombre de la empresa is required';
        if (!asesorventas) throw 'Asesor de ventas is required';

        return new ProveedorEntity(Number(id), nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion);
    }
}
