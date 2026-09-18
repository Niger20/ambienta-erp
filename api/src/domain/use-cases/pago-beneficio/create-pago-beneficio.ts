import { CreatePagoBeneficioDto } from "../../dtos/pago-beneficio/create-pago-beneficio.dto";
import { PagoBeneficioEntity } from "../../entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../repositories/pago-beneficio.repository";

export interface CreatePagoBeneficioUseCase {
    execute(dto: CreatePagoBeneficioDto): Promise<PagoBeneficioEntity>;
}

export class CreatePagoBeneficio implements CreatePagoBeneficioUseCase {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    execute(dto: CreatePagoBeneficioDto): Promise<PagoBeneficioEntity> {
        return this.repository.create(dto);
    }
}
