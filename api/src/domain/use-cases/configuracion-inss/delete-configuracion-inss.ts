import { ConfiguracionInssEntity } from "../../entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../repositories/configuracion-inss.repository";

export interface DeleteConfiguracionInssUseCase {
    execute(id: number): Promise<ConfiguracionInssEntity>;
}

export class DeleteConfiguracionInss implements DeleteConfiguracionInssUseCase {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    execute(id: number): Promise<ConfiguracionInssEntity> {
        return this.repository.delete(id);
    }
}
