import { HistorialSalarioEntity } from "../../entitites/historial-salario.entity";
import { HistorialSalarioRepository } from "../../repositories/historial-salario.repository";

export interface GetByIdHistorialSalarioUseCase {
    execute(id: number): Promise<HistorialSalarioEntity | null>;
}

export class GetByIdHistorialSalario implements GetByIdHistorialSalarioUseCase {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    execute(id: number): Promise<HistorialSalarioEntity | null> {
        return this.repository.getById(id);
    }
}
