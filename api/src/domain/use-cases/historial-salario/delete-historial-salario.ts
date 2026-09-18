import { HistorialSalarioEntity } from "../../entitites/historial-salario.entity";
import { HistorialSalarioRepository } from "../../repositories/historial-salario.repository";

export interface DeleteHistorialSalarioUseCase {
    execute(id: number): Promise<HistorialSalarioEntity>;
}

export class DeleteHistorialSalario implements DeleteHistorialSalarioUseCase {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    execute(id: number): Promise<HistorialSalarioEntity> {
        return this.repository.delete(id);
    }
}
