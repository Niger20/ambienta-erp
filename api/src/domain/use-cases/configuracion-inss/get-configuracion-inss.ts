import { PaginatedResult } from "../../dtos/shared/pagination.dto";
import { ConfiguracionInssEntity } from "../../entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../repositories/configuracion-inss.repository";

export interface GetConfiguracionInssUseCase {
    execute(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<ConfiguracionInssEntity>>;
}

export class GetConfiguracionInss implements GetConfiguracionInssUseCase {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    execute(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<ConfiguracionInssEntity>> {
        return this.repository.getAll(page, limit, activo);
    }
}
