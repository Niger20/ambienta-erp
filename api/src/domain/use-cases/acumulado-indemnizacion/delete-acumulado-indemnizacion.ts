import { AcumuladoIndemnizacionEntity } from "../../entitites/acumulado-indemnizacion.entity";
import { AcumuladoIndemnizacionRepository } from "../../repositories/acumulado-indemnizacion.repository";

export interface DeleteAcumuladoIndemnizacionUseCase {
    execute(id: number): Promise<AcumuladoIndemnizacionEntity>;
}

export class DeleteAcumuladoIndemnizacion implements DeleteAcumuladoIndemnizacionUseCase {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    execute(id: number): Promise<AcumuladoIndemnizacionEntity> {
        return this.repository.delete(id);
    }
}
