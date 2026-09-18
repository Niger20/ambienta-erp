export class CreateClienteDto {

    private constructor(
        public readonly nombre: string,
        public readonly cedula?: string | null,
        public readonly telefono?: string | null,
        public readonly direccion?: string | null,
        public readonly ubicaciongeografica?: string | null,
        public readonly limitecredito?: number | null,
        public readonly categoriaclienteid?: number | null,
        public readonly tipocliente?: string | null,
        public readonly ruc?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateClienteDto?] {
        const { nombre, cedula, telefono, direccion, ubicaciongeografica, limitecredito, categoriaclienteid, tipocliente, ruc } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (cedula != null && typeof cedula !== 'string') return ['La cedula debe ser una cadena de texto', undefined];
        if (ruc != null && typeof ruc !== 'string') return ['El RUC debe ser una cadena de texto', undefined];

        let cleanTelefono = telefono;
        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            cleanTelefono = telefono.replace(/\D/g, '');
            if (cleanTelefono === '') return ['El telefono debe contener numeros', undefined];
        }

        if (direccion != null && typeof direccion !== 'string') return ['La direccion debe ser una cadena de texto', undefined];
        if (ubicaciongeografica != null && typeof ubicaciongeografica !== 'string') return ['La ubicacion geografica debe ser una cadena de texto', undefined];

        let parsedLimitecredito: number | null | undefined;
        if (limitecredito != null) {
            if (typeof limitecredito === 'number') {
                if (Number.isNaN(limitecredito)) return ['El limite de credito debe ser un numero valido', undefined];
                parsedLimitecredito = limitecredito;
            } else if (typeof limitecredito === 'string') {
                const trimmed = limitecredito.trim();
                const numberRegex = /^\d+(\.\d+)?$/;
                if (!numberRegex.test(trimmed)) return ['El limite de credito debe ser un numero valido', undefined];
                parsedLimitecredito = Number(trimmed);
            } else {
                return ['El limite de credito debe ser un numero valido', undefined];
            }
        }

        let parsedCategoriaId: number | null | undefined;
        if (categoriaclienteid != null) {
            const parsed = Number(categoriaclienteid);
            if (Number.isNaN(parsed)) return ['La categoria del cliente debe ser un numero', undefined];
            parsedCategoriaId = parsed;
        }

        return [undefined, new CreateClienteDto(
            nombre,
            cedula ?? null,
            cleanTelefono ?? null,
            direccion ?? null,
            ubicaciongeografica ?? null,
            parsedLimitecredito ?? null,
            parsedCategoriaId ?? null,
            tipocliente ?? 'NATURAL',
            ruc ?? null
        )];
    }
}