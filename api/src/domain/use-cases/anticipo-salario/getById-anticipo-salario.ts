import { AnticipoSalarioEntity } from "../../entitites/anticipo-salario.entity";
import { AnticipoSalarioRepository } from "../../repositories/anticipo-salario.repository";

export interface GetByIdAnticipoSalarioUseCase {
    execute(id: number): Promise<AnticipoSalarioEntity | null>;
}

export class GetByIdAnticipoSalario implements GetByIdAnticipoSalarioUseCase {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    execute(id: number): Promise<AnticipoSalarioEntity | null> {
        return this.repository.getById(id);
    }
}
