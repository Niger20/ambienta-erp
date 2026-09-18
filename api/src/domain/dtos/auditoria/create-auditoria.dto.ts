export class CreateAuditoriaDto {

    private constructor(
        public readonly tabla: string,
        public readonly operacion: string,
        public readonly usuarioid?: number | null,
        public readonly datosanteriores?: any,
        public readonly datosnuevos?: any,
        public readonly fecha?: Date | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateAuditoriaDto?] {
        const { tabla, operacion, usuarioid, datosanteriores, datosnuevos, fecha } = props;

        if (!tabla) return ['La tabla es obligatoria', undefined];
        if (typeof tabla !== 'string') return ['La tabla debe ser una cadena de texto', undefined];

        if (!operacion) return ['La operación es obligatoria', undefined];
        if (typeof operacion !== 'string') return ['La operación debe ser una cadena de texto', undefined];

        let parsedUsuarioId: number | null = null;
        if (usuarioid != null) {
            const parsed = Number(usuarioid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['El usuario ID debe ser un número entero válido', undefined];
            }
            parsedUsuarioId = parsed;
        }

        let parsedFecha: Date | null = new Date();
        if (fecha != null) {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return ['La fecha es inválida', undefined];
            parsedFecha = d;
        }

        return [
            undefined,
            new CreateAuditoriaDto(
                tabla.trim(),
                operacion.trim().toUpperCase(),
                parsedUsuarioId,
                datosanteriores,
                datosnuevos,
                parsedFecha
            )
        ];
    }
}
