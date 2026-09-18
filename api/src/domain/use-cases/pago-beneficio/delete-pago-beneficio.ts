import { PagoBeneficioEntity } from "../../entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../repositories/pago-beneficio.repository";

export interface DeletePagoBeneficioUseCase {
    execute(id: number): Promise<PagoBeneficioEntity>;
}

export class DeletePagoBeneficio implements DeletePagoBeneficioUseCase {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    execute(id: number): Promise<PagoBeneficioEntity> {
        return this.repository.delete(id);
    }
}
