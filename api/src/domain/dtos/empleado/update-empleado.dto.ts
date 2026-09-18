export class UpdateEmpleadoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly apellidos?: string,
        public readonly cedula?: string,
        public readonly salariobase?: number,
        public readonly fechaingreso?: Date,
        public readonly cargo?: string,
        public readonly tipocontrato?: string,
        public readonly tipojornada?: string,
        public readonly horasdiariasjornada?: number,
        public readonly tipopago?: string,
        public readonly estado?: boolean,
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
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.apellidos != null) returnObj.apellidos = this.apellidos;
        if (this.cedula != null) returnObj.cedula = this.cedula;
        if (this.salariobase != null) returnObj.salariobase = this.salariobase;
        if (this.fechaingreso !== undefined) returnObj.fechaingreso = this.fechaingreso;
        if (this.cargo != null) returnObj.cargo = this.cargo;
        if (this.tipocontrato != null) returnObj.tipocontrato = this.tipocontrato;
        if (this.tipojornada != null) returnObj.tipojornada = this.tipojornada;
        if (this.horasdiariasjornada != null) returnObj.horasdiariasjornada = this.horasdiariasjornada;
        if (this.tipopago != null) returnObj.tipopago = this.tipopago;
        if (this.estado !== undefined) returnObj.estado = this.estado;
        if (this.numeroinss !== undefined) returnObj.numeroinss = this.numeroinss;
        if (this.fechanacimiento !== undefined) returnObj.fechanacimiento = this.fechanacimiento;
        if (this.sexo !== undefined) returnObj.sexo = this.sexo;
        if (this.telefono !== undefined) returnObj.telefono = this.telefono;
        if (this.email !== undefined) returnObj.email = this.email;
        if (this.direcciondomicilio !== undefined) returnObj.direcciondomicilio = this.direcciondomicilio;
        if (this.departamentoid !== undefined) returnObj.departamentoid = this.departamentoid;
        if (this.cargoid !== undefined) returnObj.cargoid = this.cargoid;
        if (this.banco !== undefined) returnObj.banco = this.banco;
        if (this.cuentabancaria !== undefined) returnObj.cuentabancaria = this.cuentabancaria;
        if (this.tipocuenta !== undefined) returnObj.tipocuenta = this.tipocuenta;
        if (this.fechasalida !== undefined) returnObj.fechasalida = this.fechasalida;
        if (this.motivosalida !== undefined) returnObj.motivosalida = this.motivosalida;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateEmpleadoDto?] {
        const {
            id,
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
            tipocuenta,
            fechasalida,
            motivosalida
        } = props;
        const nombre = props.nombre ?? (props.primernombre ? [props.primernombre, props.segundonombre].filter(Boolean).join(' ') : undefined);
        const apellidos = props.apellidos ?? (props.primerapellido ? [props.primerapellido, props.segundoapellido].filter(Boolean).join(' ') : undefined);

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedIngreso: Date | undefined;
        const inputFecha = fechaingreso ?? fechacontratacion;
        if (inputFecha !== undefined) {
            const d = new Date(inputFecha);
            if (isNaN(d.getTime())) return ['La fecha de ingreso es inválida', undefined];
            parsedIngreso = d;
        }

        let parsedNac: Date | null | undefined;
        if (fechanacimiento !== undefined) {
            if (fechanacimiento === null) {
                parsedNac = null;
            } else {
                const d = new Date(fechanacimiento);
                if (!isNaN(d.getTime())) parsedNac = d;
            }
        }

        let parsedSalida: Date | null | undefined;
        if (fechasalida !== undefined) {
            if (fechasalida === null) {
                parsedSalida = null;
            } else {
                const d = new Date(fechasalida);
                if (!isNaN(d.getTime())) parsedSalida = d;
            }
        }

        return [
            undefined,
            new UpdateEmpleadoDto(
                parsedId,
                nombre ? String(nombre).trim() : undefined,
                apellidos ? String(apellidos).trim() : undefined,
                cedula ? String(cedula).trim().toUpperCase() : undefined,
                salariobase != null ? Number(salariobase) : undefined,
                parsedIngreso,
                cargo ? String(cargo).trim() : undefined,
                tipocontrato ? String(tipocontrato).trim().toUpperCase() : undefined,
                tipojornada ? String(tipojornada).trim().toUpperCase() : undefined,
                horasdiariasjornada != null ? Number(horasdiariasjornada) : undefined,
                tipopago ? String(tipopago).trim().toUpperCase() : undefined,
                estado !== undefined ? Boolean(estado) : undefined,
                (numeroinss !== undefined || inss !== undefined) ? (numeroinss ?? inss ? String(numeroinss ?? inss).trim() : null) : undefined,
                parsedNac,
                sexo !== undefined ? (sexo ? String(sexo).trim().toUpperCase() : null) : undefined,
                telefono !== undefined ? (telefono ? String(telefono).trim() : null) : undefined,
                (email !== undefined || correo !== undefined) ? (email ?? correo ? String(email ?? correo).trim().toLowerCase() : null) : undefined,
                (direcciondomicilio !== undefined || direccion !== undefined) ? (direcciondomicilio ?? direccion ? String(direcciondomicilio ?? direccion).trim() : null) : undefined,
                departamentoid !== undefined ? (departamentoid != null ? Number(departamentoid) : null) : undefined,
                cargoid !== undefined ? (cargoid != null ? Number(cargoid) : null) : undefined,
                banco !== undefined ? (banco ? String(banco).trim() : null) : undefined,
                cuentabancaria !== undefined ? (cuentabancaria ? String(cuentabancaria).trim() : null) : undefined,
                tipocuenta !== undefined ? (tipocuenta ? String(tipocuenta).trim() : null) : undefined,
                parsedSalida,
                motivosalida !== undefined ? (motivosalida ? String(motivosalida).trim() : null) : undefined
            )
        ];
    }
}
