import {EmpresaEntity} from "../../entitites/empresa.entity";
import {CreateEmpresaDto} from "../../dtos";
import {EmpresaRepository} from "../../repositories/empresa.repository";


export interface CreateEmpresaUseCase {
    execute( dto: CreateEmpresaDto ): Promise<EmpresaEntity>;
}

export class CreateEmpresa implements CreateEmpresaUseCase {

    constructor(private readonly empresaRepository: EmpresaRepository) {}

    execute(dto: CreateEmpresaDto): Promise<EmpresaEntity> {
        return this.empresaRepository.create(dto);
    }

}