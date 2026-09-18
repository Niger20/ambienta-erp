


export class CreateRepartidorDto {

    private constructor(
        public readonly nombre: string,
        public readonly telefono?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateRepartidorDto?] {

        const { nombre, telefono } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(telefono)) return ['El telefono solo debe contener numeros', undefined];
        }

        return [undefined, new CreateRepartidorDto(nombre, telefono)];

    }
}
