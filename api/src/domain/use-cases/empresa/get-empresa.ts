import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import {EmpresaEntity} from "../../entitites/empresa.entity";
import {EmpresaRepository} from "../../repositories/empresa.repository";


export interface GetEmpresaUseCase {
    execute(page?: number, limit?: number): Promise<PaginatedResult<EmpresaEntity>>;
}

export class GetEmpresa implements GetEmpresaUseCase {

    constructor(private readonly empresaRepository: EmpresaRepository) {}

    execute(page?: number, limit?: number): Promise<PaginatedResult<EmpresaEntity>> {
        return this.empresaRepository.getAll(page, limit);
    }

}