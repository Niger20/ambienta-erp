import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { SesionEntity } from "../../entitites/sesion.entity";
import { SesionRepository } from "../../repositories/sesion.repository";


export interface GetSesionUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<SesionEntity>>;
}

export class GetSesion implements GetSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(page?: number, limit?: number): Promise<PaginatedResult<SesionEntity>> {
        return this.sesionRepository.getAll(page, limit);
    }

}
