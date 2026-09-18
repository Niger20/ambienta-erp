import { UpdateHistorialSalarioDto } from "../../dtos/historial-salario/update-historial-salario.dto";
import { HistorialSalarioEntity } from "../../entitites/historial-salario.entity";
import { HistorialSalarioRepository } from "../../repositories/historial-salario.repository";

export interface UpdateHistorialSalarioUseCase {
    execute(dto: UpdateHistorialSalarioDto): Promise<HistorialSalarioEntity | null>;
}

export class UpdateHistorialSalario implements UpdateHistorialSalarioUseCase {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    execute(dto: UpdateHistorialSalarioDto): Promise<HistorialSalarioEntity | null> {
        return this.repository.update(dto);
    }
}
