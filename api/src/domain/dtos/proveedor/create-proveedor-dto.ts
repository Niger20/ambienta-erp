


export class CreateProveedorDto {


    private constructor(
        public readonly nombreempresa: string,
        public readonly asesorventas: string,
        public readonly telefono ?: string|null,
        public readonly direccion ?: string|null,
        public readonly ubicaciongeografica?: string,
        public readonly clasificacion?: string,
    ) {}

    static create(props: {[key: string]: any}): [string?, CreateProveedorDto?] {

        const { nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion } = props;

        if (!nombreempresa) return ['El nombre es obligatorio', undefined];
        if (!asesorventas) return ['El asesor de ventas es obligatorio', undefined];
        if (typeof nombreempresa !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (typeof asesorventas !== 'string') return ['El asesor de ventas debe ser una cadena de texto', undefined];

        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(telefono)) return ['El telefono solo debe contener numeros', undefined];
        }

        if (direccion && typeof direccion !== 'string') return ['La direccion debe ser una cadena de texto', undefined];
        if (ubicaciongeografica && typeof ubicaciongeografica !== 'string') return ['La ubicacion geografica debe ser una cadena de texto', undefined];
        if (clasificacion && typeof clasificacion !== 'string') return ['La clasificacion debe ser una cadena de texto', undefined];



        return [undefined, new CreateProveedorDto(nombreempresa, asesorventas, telefono, direccion, ubicaciongeografica, clasificacion)];

    }
}