import { AcumuladoIndemnizacionEntity } from "../../entitites/acumulado-indemnizacion.entity";
import { AcumuladoIndemnizacionRepository } from "../../repositories/acumulado-indemnizacion.repository";

export interface GetByIdAcumuladoIndemnizacionUseCase {
    execute(id: number): Promise<AcumuladoIndemnizacionEntity | null>;
}

export class GetByIdAcumuladoIndemnizacion implements GetByIdAcumuladoIndemnizacionUseCase {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    execute(id: number): Promise<AcumuladoIndemnizacionEntity | null> {
        return this.repository.getById(id);
    }
}
