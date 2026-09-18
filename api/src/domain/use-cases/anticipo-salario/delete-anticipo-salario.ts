import { AnticipoSalarioEntity } from "../../entitites/anticipo-salario.entity";
import { AnticipoSalarioRepository } from "../../repositories/anticipo-salario.repository";

export interface DeleteAnticipoSalarioUseCase {
    execute(id: number): Promise<AnticipoSalarioEntity>;
}

export class DeleteAnticipoSalario implements DeleteAnticipoSalarioUseCase {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    execute(id: number): Promise<AnticipoSalarioEntity> {
        return this.repository.delete(id);
    }
}
