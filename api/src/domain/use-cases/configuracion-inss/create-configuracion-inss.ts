import { CreateConfiguracionInssDto } from "../../dtos/configuracion-inss/create-configuracion-inss.dto";
import { ConfiguracionInssEntity } from "../../entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../repositories/configuracion-inss.repository";

export interface CreateConfiguracionInssUseCase {
    execute(dto: CreateConfiguracionInssDto): Promise<ConfiguracionInssEntity>;
}

export class CreateConfiguracionInss implements CreateConfiguracionInssUseCase {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    execute(dto: CreateConfiguracionInssDto): Promise<ConfiguracionInssEntity> {
        return this.repository.create(dto);
    }
}
