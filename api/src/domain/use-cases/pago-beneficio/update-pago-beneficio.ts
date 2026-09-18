import { UpdatePagoBeneficioDto } from "../../dtos/pago-beneficio/update-pago-beneficio.dto";
import { PagoBeneficioEntity } from "../../entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../repositories/pago-beneficio.repository";

export interface UpdatePagoBeneficioUseCase {
    execute(dto: UpdatePagoBeneficioDto): Promise<PagoBeneficioEntity | null>;
}

export class UpdatePagoBeneficio implements UpdatePagoBeneficioUseCase {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    execute(dto: UpdatePagoBeneficioDto): Promise<PagoBeneficioEntity | null> {
        return this.repository.update(dto);
    }
}
