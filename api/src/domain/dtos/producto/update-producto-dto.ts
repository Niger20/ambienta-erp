export class UpdateProductoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre?: string,
        public readonly codigobarra?: string | null,
        public readonly categoriaid?: number | null,
        public readonly descripcion?: string | null,
        public readonly preciocompra?: number,
        public readonly precioventa?: number,
        public readonly stockminimo?: number | null,
        public readonly stockactual?: number | null,
        public readonly fechavencimiento?: Date | null,
        public readonly estado?: boolean,
        public readonly unidadmedidaid?: number | null,
        public readonly preciomayoreo?: number | null,
        public readonly cantidadminimamayoreo?: number | null,
        public readonly requierefechavencimiento?: boolean,
        public readonly publicadoencatalogo?: boolean,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.nombre != null) returnObj.nombre = this.nombre;
        if (this.codigobarra !== undefined) returnObj.codigobarra = this.codigobarra;
        if (this.categoriaid !== undefined) returnObj.categoriaid = this.categoriaid;
        if (this.unidadmedidaid !== undefined) returnObj.unidadmedidaid = this.unidadmedidaid;
        if (this.descripcion !== undefined) returnObj.descripcion = this.descripcion;
        if (this.preciocompra != null) returnObj.preciocompra = this.preciocompra;
        if (this.precioventa != null) returnObj.precioventa = this.precioventa;
        // 'utilidad' is excluded — it's a GENERATED column in PostgreSQL
        if (this.stockminimo !== undefined) returnObj.stockminimo = this.stockminimo;
        // stockactual is excluded — only modifiable via manual adjustments / sales / purchases
        // if (this.stockactual != null) returnObj.stockactual = this.stockactual;
        if (this.fechavencimiento !== undefined) returnObj.fechavencimiento = this.fechavencimiento;
        if (this.estado != null) returnObj.publicadoencatalogo = this.estado;
        if (this.publicadoencatalogo !== undefined) returnObj.publicadoencatalogo = this.publicadoencatalogo;
        if (this.requierefechavencimiento !== undefined) returnObj.requierefechavencimiento = this.requierefechavencimiento;
        if (this.preciomayoreo !== undefined) returnObj.preciomayoreo = this.preciomayoreo;
        if (this.cantidadminimamayoreo !== undefined) returnObj.cantidadminimamayoreo = this.cantidadminimamayoreo;

        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateProductoDto?] {
        const { id } = props;
        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un numero', undefined];

        const {
            nombre,
            codigobarra,
            categoriaid,
            unidadmedidaid,
            descripcion,
            preciocompra,
            precioventa,
            stockminimo,
            stockactual,
            fechavencimiento,
            estado,
            preciomayoreo,
            cantidadminimamayoreo,
            requierefechavencimiento,
            publicadoencatalogo,
        } = props;

        if (nombre != null && typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];
        if (codigobarra != null && typeof codigobarra !== 'string') {
            return ['El codigo de barra debe ser una cadena de texto', undefined];
        }
        if (descripcion != null && typeof descripcion !== 'string') {
            return ['La descripcion debe ser una cadena de texto', undefined];
        }

        const parsedPrecioCompra = parseDecimal(preciocompra, true);
        if (parsedPrecioCompra?.error) return [parsedPrecioCompra.error, undefined];

        const parsedPrecioVenta = parseDecimal(precioventa, true);
        if (parsedPrecioVenta?.error) return [parsedPrecioVenta.error, undefined];

        const parsedCategoriaId = parseInteger(categoriaid, 'La categoria debe ser un numero valido');
        if (parsedCategoriaId?.error) return [parsedCategoriaId.error, undefined];

        const parsedUnidadMedidaId = parseInteger(unidadmedidaid, 'La unidad de medida debe ser un numero valido');
        if (parsedUnidadMedidaId?.error) return [parsedUnidadMedidaId.error, undefined];

        // 'utilidad' is a GENERATED column — not validated or stored

        const parsedStockMinimo = parseDecimalWithValidation(stockminimo, 'El stock minimo debe ser un numero valido');
        if (parsedStockMinimo?.error) return [parsedStockMinimo.error, undefined];

        const parsedStockActual = parseDecimalWithValidation(stockactual, 'El stock actual debe ser un numero valido');
        if (parsedStockActual?.error) return [parsedStockActual.error, undefined];

        const parsedPrecioMayoreo = parseDecimal(preciomayoreo, true);
        if (parsedPrecioMayoreo?.error) return [parsedPrecioMayoreo.error, undefined];

        const parsedCantidadMinimaMayoreo = parseDecimalWithValidation(cantidadminimamayoreo, 'La cantidad minima de mayoreo debe ser un numero valido');
        if (parsedCantidadMinimaMayoreo?.error) return [parsedCantidadMinimaMayoreo.error, undefined];

        const hasPrecioMayoreo = parsedPrecioMayoreo?.value !== undefined && parsedPrecioMayoreo?.value !== null;
        const hasCantMayoreo = parsedCantidadMinimaMayoreo?.value !== undefined && parsedCantidadMinimaMayoreo?.value !== null;

        if (hasPrecioMayoreo && !hasCantMayoreo && parsedCantidadMinimaMayoreo?.value === null) {
            return ['Si se especifica precio de mayoreo, se debe especificar la cantidad mínima de mayoreo (y viceversa).', undefined];
        }
        if (!hasPrecioMayoreo && parsedPrecioMayoreo?.value === null && hasCantMayoreo) {
            return ['Si se especifica precio de mayoreo, se debe especificar la cantidad mínima de mayoreo (y viceversa).', undefined];
        }

        let parsedFecha: Date | null | undefined;
        if (fechavencimiento != null) {
            const dateObj = fechavencimiento instanceof Date ? fechavencimiento : new Date(fechavencimiento);
            if (Number.isNaN(dateObj.getTime())) return ['La fecha de vencimiento debe ser una fecha valida', undefined];
            parsedFecha = dateObj;
        }

        let parsedEstado: boolean | undefined;
        if (estado != null) {
            const [estadoError, value] = parseEstado(estado);
            if (estadoError) return [estadoError, undefined];
            parsedEstado = value;
        }

        let parsedPublicado: boolean | undefined;
        if (publicadoencatalogo != null) {
            const [pubError, pubVal] = parseEstado(publicadoencatalogo);
            if (pubError) return [pubError, undefined];
            parsedPublicado = pubVal;
        }

        let parsedRequiereVenc: boolean | undefined;
        if (requierefechavencimiento != null) {
            const [reqError, reqVal] = parseEstado(requierefechavencimiento);
            if (reqError) return [reqError, undefined];
            parsedRequiereVenc = reqVal;
        }

        return [
            undefined,
            new UpdateProductoDto(
                parsedId,
                nombre,
                codigobarra !== undefined ? codigobarra : undefined,
                parsedCategoriaId !== undefined ? parsedCategoriaId.value : undefined,
                descripcion !== undefined ? descripcion : undefined,
                parsedPrecioCompra?.value,
                parsedPrecioVenta?.value,
                parsedStockMinimo !== undefined ? parsedStockMinimo.value : undefined,
                parsedStockActual !== undefined ? parsedStockActual.value : undefined,
                parsedFecha !== undefined ? parsedFecha : (fechavencimiento === null ? null : undefined),
                parsedEstado,
                parsedUnidadMedidaId !== undefined ? parsedUnidadMedidaId.value : undefined,
                parsedPrecioMayoreo !== undefined ? parsedPrecioMayoreo.value : undefined,
                parsedCantidadMinimaMayoreo !== undefined ? parsedCantidadMinimaMayoreo.value : undefined,
                parsedRequiereVenc,
                parsedPublicado
            ),
        ];

        function parseDecimal(
            value: any,
            optional?: boolean
        ): { value?: number; error?: string } | undefined {
            if (value == null) return optional ? { value: undefined } : { error: 'El valor debe ser un numero valido' };
            if (typeof value === 'number') return Number.isNaN(value) ? { error: 'El valor debe ser un numero valido' } : { value };
            if (typeof value === 'string') {
                const trimmed = value.trim();
                const numberRegex = /^\d+(\.\d+)?$/;
                if (!numberRegex.test(trimmed)) return { error: 'El valor debe ser un numero valido' };
                const parsed = Number(trimmed);
                return Number.isNaN(parsed) ? { error: 'El valor debe ser un numero valido' } : { value: parsed };
            }
            return { error: 'El valor debe ser un numero valido' };
        }

        function parseInteger(value: any, errorMessage: string): { value?: number | null; error?: string } | undefined {
            if (value == null) return { value: null };
            if (typeof value === 'number') {
                if (Number.isNaN(value) || !Number.isInteger(value)) return { error: errorMessage };
                return { value };
            }
            if (typeof value === 'string') {
                const trimmed = value.trim();
                const intRegex = /^\d+$/;
                if (!intRegex.test(trimmed)) return { error: errorMessage };
                const parsed = Number(trimmed);
                if (!Number.isInteger(parsed)) return { error: errorMessage };
                return { value: parsed };
            }
            return { error: errorMessage };
        }

        function parseDecimalWithValidation(value: any, errorMessage: string): { value?: number | null; error?: string } | undefined {
            if (value == null) return { value: null };
            if (typeof value === 'number') {
                if (Number.isNaN(value)) return { error: errorMessage };
                return { value };
            }
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed === '') return { value: null };
                const numberRegex = /^\d+(\.\d+)?$/;
                if (!numberRegex.test(trimmed)) return { error: errorMessage };
                const parsed = Number(trimmed);
                if (Number.isNaN(parsed)) return { error: errorMessage };
                return { value: parsed };
            }
            return { error: errorMessage };
        }

        function parseEstado(value: any): [string?, boolean?] {
            if (typeof value === 'boolean') return [undefined, value];
            if (typeof value === 'string') {
                const lower = value.toLowerCase();
                if (lower === 'true') return [undefined, true];
                if (lower === 'false') return [undefined, false];
            }
            if (typeof value === 'number') return [undefined, value !== 0];
            return ['El estado debe ser booleano', undefined];
        }
    }
}
