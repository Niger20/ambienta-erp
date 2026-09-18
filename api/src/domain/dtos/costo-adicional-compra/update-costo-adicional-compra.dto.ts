export class UpdateCostoAdicionalCompraDto {

    private constructor(
        public readonly id: number,
        public readonly compraid?: number,
        public readonly concepto?: string,
        public readonly monto?: number,
    ) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.compraid != null) returnObj.compraid = this.compraid;
        if (this.concepto != null) returnObj.concepto = this.concepto;
        if (this.monto != null) returnObj.monto = this.monto;
        return returnObj;
    }

    static create(props: { [key: string]: any }): [string?, UpdateCostoAdicionalCompraDto?] {
        const { id, compraid, concepto, monto } = props;

        const parsedId = Number(id);
        if (id == null || Number.isNaN(parsedId)) return ['El id es obligatorio y debe ser un número válido', undefined];

        let parsedCompraId: number | undefined;
        if (compraid != null) {
            const parsed = Number(compraid);
            if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
                return ['La compra ID debe ser un número entero válido', undefined];
            }
            parsedCompraId = parsed;
        }

        if (concepto != null && typeof concepto !== 'string') return ['El concepto debe ser una cadena de texto', undefined];

        let parsedMonto: number | undefined;
        if (monto != null) {
            const parsed = Number(monto);
            if (Number.isNaN(parsed) || parsed < 0) {
                return ['El monto debe ser un número positivo válido', undefined];
            }
            parsedMonto = parsed;
        }

        return [
            undefined,
            new UpdateCostoAdicionalCompraDto(
                parsedId,
                parsedCompraId,
                concepto?.trim(),
                parsedMonto
            )
        ];
    }
}
