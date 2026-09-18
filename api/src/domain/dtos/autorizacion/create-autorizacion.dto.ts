export class CreateAutorizacionDto {
    private constructor(
        public readonly usuarioid: number,
        public readonly accion: string,
        public readonly detalle?: string
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateAutorizacionDto?] {
        const { usuarioid, accion, detalle } = props;

        if (!usuarioid) return ['El usuario id es obligatorio', undefined];
        const parsedUsuarioId = Number(usuarioid);
        if (Number.isNaN(parsedUsuarioId) || !Number.isInteger(parsedUsuarioId)) {
            return ['El usuario id debe ser un numero entero', undefined];
        }

        if (!accion) return ['La accion es obligatoria', undefined];
        if (typeof accion !== 'string') return ['La accion debe ser una cadena de texto', undefined];

        let parsedDetalle: string | undefined = undefined;
        if (detalle !== undefined && detalle !== null) {
            parsedDetalle = String(detalle);
        }

        return [undefined, new CreateAutorizacionDto(parsedUsuarioId, accion, parsedDetalle)];
    }
}
