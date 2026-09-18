export class OpenSesionDto {

    private constructor(
        public readonly usuarioid: number,
        public readonly montoinicial: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, OpenSesionDto?] {
        const { usuarioid, montoinicial } = props;

        if (usuarioid == null) return ['El usuario id es obligatorio', undefined];
        const parsedUsuarioId = Number(usuarioid);
        if (Number.isNaN(parsedUsuarioId) || !Number.isInteger(parsedUsuarioId)) {
            return ['El usuario id debe ser un numero entero valido', undefined];
        }

        if (montoinicial == null) return ['El monto inicial es obligatorio', undefined];
        const parsedMontoInicial = OpenSesionDto.parseDecimalValue(montoinicial);

        return [undefined, new OpenSesionDto(
            parsedUsuarioId,
            parsedMontoInicial,
        )];
    }

    private static parseDecimalValue(value: any): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw 'El monto inicial debe ser un numero valido';
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'El monto inicial debe ser un numero valido';
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'El monto inicial debe ser un numero valido';
            return parsed;
        }
        throw 'El monto inicial debe ser un numero valido';
    }
}
