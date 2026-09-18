import { UpdateAcumuladoIndemnizacionDto } from "../../dtos/acumulado-indemnizacion/update-acumulado-indemnizacion.dto";
import { AcumuladoIndemnizacionEntity } from "../../entitites/acumulado-indemnizacion.entity";
import { AcumuladoIndemnizacionRepository } from "../../repositories/acumulado-indemnizacion.repository";

export interface UpdateAcumuladoIndemnizacionUseCase {
    execute(dto: UpdateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity | null>;
}

export class UpdateAcumuladoIndemnizacion implements UpdateAcumuladoIndemnizacionUseCase {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    execute(dto: UpdateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity | null> {
        return this.repository.update(dto);
    }
}
