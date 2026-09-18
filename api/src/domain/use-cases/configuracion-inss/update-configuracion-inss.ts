import { UpdateConfiguracionInssDto } from "../../dtos/configuracion-inss/update-configuracion-inss.dto";
import { ConfiguracionInssEntity } from "../../entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../repositories/configuracion-inss.repository";

export interface UpdateConfiguracionInssUseCase {
    execute(dto: UpdateConfiguracionInssDto): Promise<ConfiguracionInssEntity | null>;
}

export class UpdateConfiguracionInss implements UpdateConfiguracionInssUseCase {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    execute(dto: UpdateConfiguracionInssDto): Promise<ConfiguracionInssEntity | null> {
        return this.repository.update(dto);
    }
}
