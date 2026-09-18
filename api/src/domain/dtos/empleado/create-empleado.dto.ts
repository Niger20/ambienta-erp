export class CreateEmpleadoDto {

    private constructor(
        public readonly nombre: string,
        public readonly apellidos: string,
        public readonly cedula: string,
        public readonly salariobase: number,
        public readonly fechaingreso: Date,
        public readonly cargo: string,
        public readonly tipocontrato: string = 'INDEFINIDO',
        public readonly tipojornada: string = 'DIURNA',
        public readonly horasdiariasjornada: number = 8.0,
        public readonly tipopago: string = 'MENSUAL',
        public readonly estado: boolean = true,
        public readonly numeroinss?: string | null,
        public readonly fechanacimiento?: Date | null,
        public readonly sexo?: string | null,
        public readonly telefono?: string | null,
        public readonly email?: string | null,
        public readonly direcciondomicilio?: string | null,
        public readonly departamentoid?: number | null,
        public readonly cargoid?: number | null,
        public readonly banco?: string | null,
        public readonly cuentabancaria?: string | null,
        public readonly tipocuenta?: string | null,
    ) {}

    static create(props: { [key: string]: any }): [string?, CreateEmpleadoDto?] {
        const nombre = props.nombre ?? [props.primernombre, props.segundonombre].filter(Boolean).join(' ');
        const apellidos = props.apellidos ?? [props.primerapellido, props.segundoapellido].filter(Boolean).join(' ');
        const {
            cedula,
            salariobase,
            fechaingreso,
            fechacontratacion,
            cargo,
            tipocontrato,
            tipojornada,
            horasdiariasjornada,
            tipopago,
            estado,
            numeroinss,
            inss,
            fechanacimiento,
            sexo,
            telefono,
            email,
            correo,
            direcciondomicilio,
            direccion,
            departamentoid,
            cargoid,
            banco,
            cuentabancaria,
            tipocuenta
        } = props;

        if (!nombre || typeof nombre !== 'string') return ['El nombre del empleado es obligatorio', undefined];
        if (!apellidos || typeof apellidos !== 'string') return ['Los apellidos del empleado son obligatorios', undefined];
        if (!cedula || typeof cedula !== 'string') return ['La cédula es obligatoria', undefined];

        if (salariobase == null) return ['El salario base es obligatorio', undefined];
        const parsedSalario = Number(salariobase);
        if (Number.isNaN(parsedSalario) || parsedSalario < 0) return ['El salario base debe ser un número válido', undefined];

        let parsedIngreso = new Date();
        const inputFecha = fechaingreso ?? fechacontratacion;
        if (inputFecha) {
            const d = new Date(inputFecha);
            if (isNaN(d.getTime())) return ['La fecha de ingreso es inválida', undefined];
            parsedIngreso = d;
        }

        let parsedNac: Date | null = null;
        if (fechanacimiento) {
            const d = new Date(fechanacimiento);
            if (!isNaN(d.getTime())) parsedNac = d;
        }

        return [
            undefined,
            new CreateEmpleadoDto(
                nombre.trim(),
                apellidos.trim(),
                cedula.trim().toUpperCase(),
                parsedSalario,
                parsedIngreso,
                cargo ? String(cargo).trim() : 'General',
                tipocontrato ? String(tipocontrato).trim().toUpperCase() : 'INDEFINIDO',
                tipojornada ? String(tipojornada).trim().toUpperCase() : 'DIURNA',
                horasdiariasjornada != null ? Number(horasdiariasjornada) : 8.0,
                tipopago ? String(tipopago).trim().toUpperCase() : 'MENSUAL',
                estado !== undefined ? Boolean(estado) : true,
                (numeroinss ?? inss) ? String(numeroinss ?? inss).trim() : null,
                parsedNac,
                sexo ? String(sexo).trim().toUpperCase() : null,
                telefono ? String(telefono).trim() : null,
                (email ?? correo) ? String(email ?? correo).trim().toLowerCase() : null,
                (direcciondomicilio ?? direccion) ? String(direcciondomicilio ?? direccion).trim() : null,
                departamentoid != null ? Number(departamentoid) : null,
                cargoid != null ? Number(cargoid) : null,
                banco ? String(banco).trim() : null,
                cuentabancaria ? String(cuentabancaria).trim() : null,
                tipocuenta ? String(tipocuenta).trim() : null
            )
        ];
    }
}
