import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePagoBeneficioDto } from "../../domain/dtos/pago-beneficio/create-pago-beneficio.dto";
import { UpdatePagoBeneficioDto } from "../../domain/dtos/pago-beneficio/update-pago-beneficio.dto";
import { PagoBeneficioDatasource } from "../../domain/datasources/pago-beneficio.datasource";
import { PagoBeneficioEntity } from "../../domain/entitites/pago-beneficio.entity";
import { PagoBeneficioRepository } from "../../domain/repositories/pago-beneficio.repository";

export class PagoBeneficioRepositoryImpl implements PagoBeneficioRepository {
    constructor(private readonly datasource: PagoBeneficioDatasource) {}

    create(dto: CreatePagoBeneficioDto): Promise<PagoBeneficioEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, tipobeneficio?: string): Promise<PaginatedResult<PagoBeneficioEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, tipobeneficio);
    }

    getById(id: number): Promise<PagoBeneficioEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePagoBeneficioDto): Promise<PagoBeneficioEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PagoBeneficioEntity> {
        return this.datasource.delete(id);
    }
}
