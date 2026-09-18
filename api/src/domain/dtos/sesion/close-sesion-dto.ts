export class CloseSesionDto {

    private constructor(
        public readonly id: number,
        public readonly montofinalfisico: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CloseSesionDto?] {
        const { id, montofinalfisico } = props;

        if (id == null) return ['El id de la sesion es obligatorio', undefined];
        const parsedId = Number(id);
        if (Number.isNaN(parsedId) || !Number.isInteger(parsedId)) {
            return ['El id debe ser un numero entero valido', undefined];
        }

        if (montofinalfisico == null) return ['El monto final fisico es obligatorio', undefined];
        const parsedMontoFinalFisico = CloseSesionDto.parseDecimalValue(montofinalfisico);

        return [undefined, new CloseSesionDto(
            parsedId,
            parsedMontoFinalFisico,
        )];
    }

    private static parseDecimalValue(value: any): number {
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw 'El monto final fisico debe ser un numero valido';
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) throw 'El monto final fisico debe ser un numero valido';
            return parsed;
        }
        if (value && typeof value.toNumber === 'function') {
            const parsed = value.toNumber();
            if (!Number.isFinite(parsed)) throw 'El monto final fisico debe ser un numero valido';
            return parsed;
        }
        throw 'El monto final fisico debe ser un numero valido';
    }
}
