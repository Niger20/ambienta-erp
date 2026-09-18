import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreateConfiguracionInssDto } from "../../domain/dtos/configuracion-inss/create-configuracion-inss.dto";
import { UpdateConfiguracionInssDto } from "../../domain/dtos/configuracion-inss/update-configuracion-inss.dto";
import { ConfiguracionInssDatasource } from "../../domain/datasources/configuracion-inss.datasource";
import { ConfiguracionInssEntity } from "../../domain/entitites/configuracion-inss.entity";
import { ConfiguracionInssRepository } from "../../domain/repositories/configuracion-inss.repository";

export class ConfiguracionInssRepositoryImpl implements ConfiguracionInssRepository {
    constructor(private readonly datasource: ConfiguracionInssDatasource) {}

    create(dto: CreateConfiguracionInssDto): Promise<ConfiguracionInssEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, activo?: boolean): Promise<PaginatedResult<ConfiguracionInssEntity>> {
        return this.datasource.getAll(page, limit, activo);
    }

    getById(id: number): Promise<ConfiguracionInssEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateConfiguracionInssDto): Promise<ConfiguracionInssEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<ConfiguracionInssEntity> {
        return this.datasource.delete(id);
    }
}
