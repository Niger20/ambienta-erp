import { PaginatedResult } from "../dtos/shared/pagination.dto";
import {EmpresaEntity} from "../entitites/empresa.entity";
import {CreateEmpresaDto, UpdateEmpresaDto} from "../dtos";


export abstract class EmpresaRepository {

    abstract create( create : CreateEmpresaDto): Promise<EmpresaEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<EmpresaEntity>>;
    abstract update( UpdateEmpresaDto : UpdateEmpresaDto): Promise<EmpresaEntity|null>;

}