export class UpdateEmpresaDto {

    private constructor(
        public readonly id: number,
        public readonly nombreempresa?: string | null,
        public readonly direccion?: string | null,
        public readonly telefono?: string | null,
        public readonly ruc?: string | null,
        public readonly tasacambio?: number | null,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombreempresa != null) returnObj.nombreempresa = this.nombreempresa;
        if (this.direccion != null) returnObj.direccion = this.direccion;
        if (this.telefono != null) returnObj.telefono = this.telefono;
        if (this.ruc != null) returnObj.ruc = this.ruc;
        if (this.tasacambio != null) returnObj.tasacambio = this.tasacambio;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateEmpresaDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

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

        let parsedTasaCambio: number | null | undefined;
        if (tasacambio != null) {
            const parsed = Number(tasacambio);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                return ['La tasa de cambio debe ser un numero positivo valido', undefined];
            }
            parsedTasaCambio = parsed;
        }

        return [undefined, new UpdateEmpresaDto(parsedId, nombreempresa, direccion, telefono, ruc, parsedTasaCambio)];
    }
}
