import { CreateHistorialSalarioDto } from "../../dtos/historial-salario/create-historial-salario.dto";
import { HistorialSalarioEntity } from "../../entitites/historial-salario.entity";
import { HistorialSalarioRepository } from "../../repositories/historial-salario.repository";

export interface CreateHistorialSalarioUseCase {
    execute(dto: CreateHistorialSalarioDto): Promise<HistorialSalarioEntity>;
}

export class CreateHistorialSalario implements CreateHistorialSalarioUseCase {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    execute(dto: CreateHistorialSalarioDto): Promise<HistorialSalarioEntity> {
        return this.repository.create(dto);
    }
}
