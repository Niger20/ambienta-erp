export class UpdateRepartidorDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly telefono?: string | null,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.telefono != null) returnObj.telefono = this.telefono;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateRepartidorDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const { nombre, telefono } = props;

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (telefono != null) {
            if (typeof telefono !== 'string') return ['El telefono debe ser una cadena de texto', undefined];
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(telefono)) return ['El telefono solo debe contener numeros', undefined];
        }

        return [undefined, new UpdateRepartidorDto(parsedId, nombre, telefono)];
    }
}