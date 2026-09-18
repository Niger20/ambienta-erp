export class GetUtilidadProductoDto {

    // Nicaragua timezone offset: UTC-6
    private static readonly TZ_OFFSET = '-06:00';

    private constructor(
        public readonly fechaInicio: Date,
        public readonly fechaFin: Date,
    ) { }

    static create(props: { [key: string]: any }): [string?, GetUtilidadProductoDto?] {
        const { fechaInicio, fechaFin } = props;

        // Default: today in Nicaragua timezone (UTC-6)
        const nowUtc = new Date();
        // Calculate current date in Nicaragua by offsetting UTC
        const nowNic = new Date(nowUtc.getTime() - 6 * 60 * 60 * 1000);
        const todayStr = nowNic.toISOString().split('T')[0]; // YYYY-MM-DD in Nicaragua time

        let start = new Date(`${todayStr}T00:00:00.000${GetUtilidadProductoDto.TZ_OFFSET}`);
        let end = new Date(`${todayStr}T23:59:59.999${GetUtilidadProductoDto.TZ_OFFSET}`);

        if (fechaInicio) {
            const dateStr = (fechaInicio as string).trim();
            // If already has timezone info or 'T', use as-is; otherwise append start-of-day in Nicaragua TZ
            const adjustedStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000${GetUtilidadProductoDto.TZ_OFFSET}`;
            start = new Date(adjustedStr);
            if (isNaN(start.getTime())) {
                return ['fechaInicio no es una fecha válida', undefined];
            }
        }

        if (fechaFin) {
            const dateStr = (fechaFin as string).trim();
            // If already has timezone info or 'T', use as-is; otherwise append end-of-day in Nicaragua TZ
            const adjustedStr = dateStr.includes('T') ? dateStr : `${dateStr}T23:59:59.999${GetUtilidadProductoDto.TZ_OFFSET}`;
            end = new Date(adjustedStr);
            if (isNaN(end.getTime())) {
                return ['fechaFin no es una fecha válida', undefined];
            }
        }

        return [undefined, new GetUtilidadProductoDto(start, end)];
    }
}
