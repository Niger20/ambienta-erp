import { ConfiguracionInssEntity } from "../../entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../repositories/configuracion-inss.repository";

export interface GetByIdConfiguracionInssUseCase {
    execute(id: number): Promise<ConfiguracionInssEntity | null>;
}

export class GetByIdConfiguracionInss implements GetByIdConfiguracionInssUseCase {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    execute(id: number): Promise<ConfiguracionInssEntity | null> {
        return this.repository.getById(id);
    }
}
