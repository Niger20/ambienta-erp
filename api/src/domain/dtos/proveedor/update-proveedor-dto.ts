export class UpdateProveedorDto {

    private constructor(
        public readonly id: number,
        public readonly nombreempresa?: string,
        public readonly asesorventas?: string,
        public readonly telefono?: string|null,
        public readonly direccion?: string|null,
        public readonly ubicaciongeografica?: string,
        public readonly clasificacion?: string,
    ) {}

    get values () {
        const returnObj: { [key: string]: any } = {};

        if (this.nombreempresa != null) returnObj.nombreempresa = this.nombreempresa;
        if (this.asesorventas != null) returnObj.asesorventas = this.asesorventas;
        if (this.telefono != null) returnObj.telefono = this.telefono;
        if (this.direccion != null) returnObj.direccion = this.direccion;
        if (this.ubicaciongeografica != null) returnObj.ubicaciongeografica = this.ubicaciongeografica;
        if (this.clasificacion != null) returnObj.clasificacion = this.clasificacion;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateProveedorDto?] {

        const { id } = props;
        const parsedId = Number(id);
        if (id == null || isNaN(parsedId)) return ['El id es obligatorio y debe ser un número', undefined];

        const { nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion } = props;

        if (nombreempresa != null && typeof nombreempresa !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (asesorventas != null && typeof asesorventas !== 'string') return ['El asesor de venta debe ser una cadena de texto', undefined];

        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(telefono)) return ['El telefono solo debe contener numeros', undefined];
        }

        if (direccion != null && typeof direccion !== 'string') return ['La direccion debe ser una cadena de texto', undefined];
        if (ubicaciongeografica != null && typeof ubicaciongeografica !== 'string') return ['La ubicacion geografica debe ser una cadena de texto', undefined];
        if (clasificacion != null && typeof clasificacion !== 'string') return ['La clasificacion debe ser una cadena de texto', undefined];

        return [undefined, new UpdateProveedorDto(parsedId, nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion)];

    }
}
