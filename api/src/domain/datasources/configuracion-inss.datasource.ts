import { CreateConfiguracionInssDto } from "../dtos/configuracion-inss/create-configuracion-inss.dto";
import { UpdateConfiguracionInssDto } from "../dtos/configuracion-inss/update-configuracion-inss.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { ConfiguracionInssEntity } from "../entitites/configuracion-inss.entity";

export abstract class ConfiguracionInssDatasource {
    abstract create(dto: CreateConfiguracionInssDto): Promise<ConfiguracionInssEntity>;
    abstract getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<ConfiguracionInssEntity>>;
    abstract getById(id: number): Promise<ConfiguracionInssEntity | null>;
    abstract update(dto: UpdateConfiguracionInssDto): Promise<ConfiguracionInssEntity | null>;
    abstract delete(id: number): Promise<ConfiguracionInssEntity>;
}
