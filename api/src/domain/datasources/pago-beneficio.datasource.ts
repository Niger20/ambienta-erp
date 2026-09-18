import { CreatePagoBeneficioDto } from "../dtos/pago-beneficio/create-pago-beneficio.dto";
import { UpdatePagoBeneficioDto } from "../dtos/pago-beneficio/update-pago-beneficio.dto";
import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PagoBeneficioEntity } from "../entitites/pago-beneficio.entity";

export abstract class PagoBeneficioDatasource {
    abstract create(dto: CreatePagoBeneficioDto): Promise<PagoBeneficioEntity>;
    abstract getAll(page?: number, limit?: number, empleadoid?: number, tipobeneficio?: string): Promise<PaginatedResult<PagoBeneficioEntity>>;
    abstract getById(id: number): Promise<PagoBeneficioEntity | null>;
    abstract update(dto: UpdatePagoBeneficioDto): Promise<PagoBeneficioEntity | null>;
    abstract delete(id: number): Promise<PagoBeneficioEntity>;
}
