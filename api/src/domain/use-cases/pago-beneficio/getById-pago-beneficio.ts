import { PagoBeneficioEntity } from "../../entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../repositories/pago-beneficio.repository";

export interface GetByIdPagoBeneficioUseCase {
    execute(id: number): Promise<PagoBeneficioEntity | null>;
}

export class GetByIdPagoBeneficio implements GetByIdPagoBeneficioUseCase {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    execute(id: number): Promise<PagoBeneficioEntity | null> {
        return this.repository.getById(id);
    }
}
