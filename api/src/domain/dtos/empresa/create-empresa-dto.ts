export class CreateEmpresaDto {

    private constructor(
        public readonly nombreempresa?: string | null,
        public readonly direccion?: string | null,
        public readonly telefono?: string | null,
        public readonly ruc?: string | null,
        public readonly tasacambio?: number | null,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateEmpresaDto?] {
        const { nombreempresa, direccion, telefono, ruc, tasacambio } = props;

        if (nombreempresa != null && typeof nombreempresa !== 'string') {
            return ['El nombre de la empresa debe ser una cadena de texto', undefined];
        }

        if (direccion != null && typeof direccion !== 'string') {
            return ['La direccion debe ser una cadena de texto', undefined];
        }

        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(telefono)) return ['El telefono solo debe contener numeros', undefined];
        }

        if (ruc != null && typeof ruc !== 'string') {
            return ['El ruc debe ser una cadena de texto', undefined];
        }

        let parsedTasaCambio: number | null | undefined = null;
        if (tasacambio != null) {
            const parsed = Number(tasacambio);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                return ['La tasa de cambio debe ser un numero positivo valido', undefined];
            }
            parsedTasaCambio = parsed;
        }

        return [undefined, new CreateEmpresaDto(nombreempresa, direccion, telefono, ruc, parsedTasaCambio)];
    }
}
