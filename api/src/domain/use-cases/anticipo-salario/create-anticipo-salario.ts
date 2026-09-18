import { CreateAnticipoSalarioDto } from "../../dtos/anticipo-salario/create-anticipo-salario.dto";
import { AnticipoSalarioEntity } from "../../entitites/anticipo-salario.entity";
import { AnticipoSalarioRepository } from "../../repositories/anticipo-salario.repository";

export interface CreateAnticipoSalarioUseCase {
    execute(dto: CreateAnticipoSalarioDto): Promise<AnticipoSalarioEntity>;
}

export class CreateAnticipoSalario implements CreateAnticipoSalarioUseCase {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    execute(dto: CreateAnticipoSalarioDto): Promise<AnticipoSalarioEntity> {
        return this.repository.create(dto);
    }
}
