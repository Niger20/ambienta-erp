export class UpdateClienteDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly cedula?: string | null,
        public readonly telefono?: string | null,
        public readonly direccion?: string | null,
        public readonly ubicaciongeografica?: string | null,
        public readonly limitecredito?: number | null,
        public readonly categoriaclienteid?: number | null,
        public readonly tipocliente?: string | null,
        public readonly ruc?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.cedula !== undefined) returnObj.cedula = this.cedula;
        if (this.telefono !== undefined) returnObj.telefono = this.telefono;
        if (this.direccion !== undefined) returnObj.direccion = this.direccion;
        if (this.ubicaciongeografica !== undefined) returnObj.ubicaciongeografica = this.ubicaciongeografica;
        if (this.limitecredito !== undefined) returnObj.limitecredito = this.limitecredito;
        if (this.categoriaclienteid !== undefined) returnObj.categoriaclienteid = this.categoriaclienteid;
        if (this.tipocliente !== undefined) returnObj.tipocliente = this.tipocliente;
        if (this.ruc !== undefined) returnObj.ruc = this.ruc;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateClienteDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { nombre, cedula, telefono, direccion, ubicaciongeografica, limitecredito, categoriaclienteid, tipocliente, ruc } = props;

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (cedula !== undefined && cedula !== null && typeof cedula !== 'string') return ['La cedula debe ser una cadena de texto', undefined];
        if (ruc !== undefined && ruc !== null && typeof ruc !== 'string') return ['El RUC debe ser una cadena de texto', undefined];

        let cleanTelefono: string | null | undefined = telefono;
        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            cleanTelefono = telefono.replace(/\D/g, '');
        }

        if (direccion !== undefined && direccion !== null && typeof direccion !== 'string') return ['La direccion debe ser una cadena de texto', undefined];
        if (ubicaciongeografica !== undefined && ubicaciongeografica !== null && typeof ubicaciongeografica !== 'string') return ['La ubicacion geografica debe ser una cadena de texto', undefined];

        let parsedLimitecredito: number | null | undefined;
        if (limitecredito !== undefined && limitecredito !== null) {
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
        if (categoriaclienteid !== undefined && categoriaclienteid !== null) {
            const parsed = Number(categoriaclienteid);
            if (Number.isNaN(parsed)) return ['La categoria del cliente debe ser un numero', undefined];
            parsedCategoriaId = parsed;
        }

        return [undefined, new UpdateClienteDto(
            parsedId,
            nombre,
            cedula,
            cleanTelefono,
            direccion,
            ubicaciongeografica,
            parsedLimitecredito,
            parsedCategoriaId,
            tipocliente,
            ruc
        )];
    }
}
