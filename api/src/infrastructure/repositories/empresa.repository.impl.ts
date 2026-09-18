import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateEmpresaDto,
    EmpresaDatasource, EmpresaEntity,
    EmpresaRepository,
    UpdateEmpresaDto
} from "../../domain";


export class EmpresaRepositoryImpl implements EmpresaRepository {

    constructor(private readonly datasource: EmpresaDatasource) {}

    create(createEmpresaDto: CreateEmpresaDto): Promise<EmpresaEntity> {
        return this.datasource.create(createEmpresaDto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<EmpresaEntity>> {
        return this.datasource.getAll(page, limit);
    }
    
    update(updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaEntity | null> {
        return this.datasource.update(updateEmpresaDto);
    }

}