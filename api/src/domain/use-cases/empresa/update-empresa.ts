import {EmpresaEntity} from "../../entitites/empresa.entity";
import { UpdateEmpresaDto} from "../../dtos";
import {EmpresaRepository} from "../../repositories/empresa.repository";


export interface UpdateEmpresaUseCase {
    execute( dto: UpdateEmpresaDto ): Promise<EmpresaEntity|null>;
}

export class UpdateEmpresa implements UpdateEmpresaUseCase {

    constructor(private readonly empresaRepository: EmpresaRepository) {}

    execute(dto: UpdateEmpresaDto): Promise<EmpresaEntity|null> {
        return this.empresaRepository.update(dto);
    }

}