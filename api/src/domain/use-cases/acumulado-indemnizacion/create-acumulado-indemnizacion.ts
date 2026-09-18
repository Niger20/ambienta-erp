import { CreateAcumuladoIndemnizacionDto } from "../../dtos/acumulado-indemnizacion/create-acumulado-indemnizacion.dto";
import { AcumuladoIndemnizacionEntity } from "../../entitites/acumulado-indemnizacion.entity";
import { AcumuladoIndemnizacionRepository } from "../../repositories/acumulado-indemnizacion.repository";

export interface CreateAcumuladoIndemnizacionUseCase {
    execute(dto: CreateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity>;
}

export class CreateAcumuladoIndemnizacion implements CreateAcumuladoIndemnizacionUseCase {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    execute(dto: CreateAcumuladoIndemnizacionDto): Promise<AcumuladoIndemnizacionEntity> {
        return this.repository.create(dto);
    }
}
