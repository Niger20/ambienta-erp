import { UpdateAnticipoSalarioDto } from "../../dtos/anticipo-salario/update-anticipo-salario.dto";
import { AnticipoSalarioEntity } from "../../entitites/anticipo-salario.entity";
import { AnticipoSalarioRepository } from "../../repositories/anticipo-salario.repository";

export interface UpdateAnticipoSalarioUseCase {
    execute(dto: UpdateAnticipoSalarioDto): Promise<AnticipoSalarioEntity | null>;
}

export class UpdateAnticipoSalario implements UpdateAnticipoSalarioUseCase {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    execute(dto: UpdateAnticipoSalarioDto): Promise<AnticipoSalarioEntity | null> {
        return this.repository.update(dto);
    }
}
