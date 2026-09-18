export class CreateProductoDto {


    private constructor(
        public readonly nombre: string,
        public readonly preciocompra: number,
        public readonly precioventa: number,
        public readonly codigobarra?: string | null,
        public readonly categoriaid?: number | null,
        public readonly descripcion?: string | null,
        public readonly utilidad?: number | null,
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

    static create(props: { [key: string]: any }): [string?, CreateProductoDto?] {
        const {
            nombre,
            preciocompra,
            precioventa,
            codigobarra,
            categoriaid,
            descripcion,
            utilidad,
            stockminimo,
            stockactual,
            fechavencimiento,
            estado,
            unidadmedidaid,
            preciomayoreo,
            cantidadminimamayoreo,
            requierefechavencimiento,
            publicadoencatalogo,
        } = props;

        if (!nombre) return ['El nombre es obligatorio', undefined];
        if (typeof nombre !== 'string') return ['El nombre debe ser una cadena de texto', undefined];

        if (codigobarra != null && typeof codigobarra !== 'string') {
            return ['El codigo de barra debe ser una cadena de texto', undefined];
        }

        if (descripcion != null && typeof descripcion !== 'string') {
            return ['La descripcion debe ser una cadena de texto', undefined];
        }

        const parsedPrecioCompra = parseDecimal(preciocompra);
        if (parsedPrecioCompra == null) return ['El precio de compra es obligatorio', undefined];

        const parsedPrecioVenta = parseDecimal(precioventa);
        if (parsedPrecioVenta == null) return ['El precio de venta es obligatorio', undefined];

        const parsedCategoriaId = parseInteger(categoriaid, 'La categoria debe ser un numero valido');
        if (parsedCategoriaId?.error) return [parsedCategoriaId.error, undefined];

        const parsedUnidadMedidaId = parseInteger(unidadmedidaid, 'La unidad de medida debe ser un numero valido');
        if (parsedUnidadMedidaId?.error) return [parsedUnidadMedidaId.error, undefined];

        const parsedUtilidad = parseDecimal(utilidad, true);
        const parsedStockMinimo = parseDecimalWithValidation(stockminimo, 'El stock minimo debe ser un numero valido');
        if (parsedStockMinimo?.error) return [parsedStockMinimo.error, undefined];

        const parsedStockActual = parseDecimalWithValidation(stockactual, 'El stock actual debe ser un numero valido');
        if (parsedStockActual?.error) return [parsedStockActual.error, undefined];

        const parsedPrecioMayoreo = parseDecimal(preciomayoreo, true);
        const parsedCantidadMinimaMayoreo = parseDecimalWithValidation(cantidadminimamayoreo, 'La cantidad minima de mayoreo debe ser un numero valido');
        if (parsedCantidadMinimaMayoreo?.error) return [parsedCantidadMinimaMayoreo.error, undefined];

        const hasPrecioMayoreo = parsedPrecioMayoreo != null && !Number.isNaN(parsedPrecioMayoreo);
        const hasCantMayoreo = parsedCantidadMinimaMayoreo?.value != null && !Number.isNaN(parsedCantidadMinimaMayoreo.value);

        if ((hasPrecioMayoreo && !hasCantMayoreo) || (!hasPrecioMayoreo && hasCantMayoreo)) {
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
            new CreateProductoDto(
                nombre,
                parsedPrecioCompra,
                parsedPrecioVenta,
                codigobarra ?? null,
                parsedCategoriaId?.value ?? null,
                descripcion ?? null,
                parsedUtilidad ?? null,
                parsedStockMinimo?.value ?? null,
                parsedStockActual?.value ?? null,
                parsedFecha ?? null,
                parsedEstado,
                parsedUnidadMedidaId?.value ?? 1,
                hasPrecioMayoreo ? parsedPrecioMayoreo : null,
                hasCantMayoreo ? parsedCantidadMinimaMayoreo?.value : null,
                parsedRequiereVenc ?? false,
                parsedPublicado ?? false
            ),
        ];

        function parseDecimal(value: any, optional?: boolean): number | null {
            if (value == null) return optional ? null : null;
            if (typeof value === 'number') return Number.isNaN(value) ? null : value;
            if (typeof value === 'string') {
                const trimmed = value.trim();
                const numberRegex = /^\d+(\.\d+)?$/;
                if (!numberRegex.test(trimmed)) return null;
                const parsed = Number(trimmed);
                return Number.isNaN(parsed) ? null : parsed;
            }
            return null;
        }

        function parseInteger(value: any, errorMessage: string): { value: number | null; error?: string } | undefined {
            if (value == null) return { value: null };
            if (typeof value === 'number') {
                if (Number.isNaN(value) || !Number.isInteger(value)) return { value: null, error: errorMessage };
                return { value };
            }
            if (typeof value === 'string') {
                const trimmed = value.trim();
                const intRegex = /^\d+$/;
                if (!intRegex.test(trimmed)) return { value: null, error: errorMessage };
                const parsed = Number(trimmed);
                if (!Number.isInteger(parsed)) return { value: null, error: errorMessage };
                return { value: parsed };
            }
            return { value: null, error: errorMessage };
        }

        function parseDecimalWithValidation(value: any, errorMessage: string): { value: number | null; error?: string } | undefined {
            if (value == null) return { value: null };
            if (typeof value === 'number') {
                if (Number.isNaN(value)) return { value: null, error: errorMessage };
                return { value };
            }
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed === '') return { value: null };
                const numberRegex = /^\d+(\.\d+)?$/;
                if (!numberRegex.test(trimmed)) return { value: null, error: errorMessage };
                const parsed = Number(trimmed);
                if (Number.isNaN(parsed)) return { value: null, error: errorMessage };
                return { value: parsed };
            }
            return { value: null, error: errorMessage };
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