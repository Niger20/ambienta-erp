export class EmpleadoEntity {

    constructor(
        public readonly id: number,
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
        public readonly fechasalida?: Date | null,
        public readonly motivosalida?: string | null,
        public readonly cargonombre?: string | null,
        public readonly departamentonombre?: string | null,
    ) {}

    get nombrecompleto(): string {
        return `${this.nombre} ${this.apellidos}`.trim();
    }

    public static fromObject(object: { [key: string]: any }): EmpleadoEntity {
        const id = object.id ?? object.empleadoid;
        const nombre = object.nombre ?? [object.primernombre, object.segundonombre].filter(Boolean).join(' ');
        const apellidos = object.apellidos ?? [object.primerapellido, object.segundoapellido].filter(Boolean).join(' ');
        const cedula = object.cedula;
        const salariobase = object.salariobase;
        const fechaingreso = object.fechaingreso ?? object.fechacontratacion ?? new Date();
        const cargo = object.cargo ?? object.cargosempleados?.nombre ?? 'General';
        const numeroinss = object.numeroinss ?? object.inss ?? null;

        if (id == null) throw 'ID es obligatorio';
        if (!nombre) throw 'Nombre del empleado es obligatorio';
        if (!apellidos) throw 'Apellidos del empleado son obligatorios';
        if (!cedula) throw 'Cédula es obligatoria';
        if (salariobase == null) throw 'Salario base es obligatorio';

        const cargonombre = object.cargosempleados?.nombre ?? object.cargonombre ?? null;
        const departamentonombre = object.departamentosempleados_empleados_departamentoidTodepartamentosempleados?.nombre
            ?? object.cargosempleados?.departamentosempleados?.nombre
            ?? object.departamentonombre
            ?? null;

        return new EmpleadoEntity(
            Number(id),
            nombre,
            apellidos,
            cedula,
            Number(salariobase),
            new Date(fechaingreso),
            cargo,
            object.tipocontrato || 'INDEFINIDO',
            object.tipojornada || 'DIURNA',
            object.horasdiariasjornada != null ? Number(object.horasdiariasjornada) : 8.0,
            object.tipopago || 'MENSUAL',
            object.estado !== undefined ? Boolean(object.estado) : true,
            numeroinss,
            object.fechanacimiento ? new Date(object.fechanacimiento) : null,
            object.sexo ?? null,
            object.telefono ?? null,
            object.email ?? object.correo ?? null,
            object.direcciondomicilio ?? object.direccion ?? null,
            object.departamentoid != null ? Number(object.departamentoid) : null,
            object.cargoid != null ? Number(object.cargoid) : null,
            object.banco ?? null,
            object.cuentabancaria ?? null,
            object.tipocuenta ?? null,
            object.fechasalida ? new Date(object.fechasalida) : null,
            object.motivosalida ?? null,
            cargonombre,
            departamentonombre
        );
    }
}
