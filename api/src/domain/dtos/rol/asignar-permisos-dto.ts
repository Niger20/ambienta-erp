export class AsignarPermisosDto {

    private constructor(
        public readonly rolid: number,
        public readonly permisoIds: number[],
    ) {}

    static create(props: { [key: string]: any }): [string?, AsignarPermisosDto?] {
        const { rolid, permisoIds } = props;

        if (!rolid || isNaN(Number(rolid))) return ['El rolid es obligatorio y debe ser un número', undefined];
        if (!Array.isArray(permisoIds)) return ['permisoIds debe ser un arreglo de números', undefined];

        const parsed: number[] = [];
        for (const value of permisoIds) {
            const n = Number(value);
            if (isNaN(n)) return ['permisoIds debe contener solo números', undefined];
            parsed.push(n);
        }

        return [undefined, new AsignarPermisosDto(Number(rolid), parsed)];
    }
}
