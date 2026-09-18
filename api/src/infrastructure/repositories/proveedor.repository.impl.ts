import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateProveedorDto,
    ProveedorDatasource, ProveedorEntity,
    ProveedorRepository,
    UpdateProveedorDto
} from "../../domain";


export class ProveedorRepositoryImpl implements ProveedorRepository {

    constructor(private readonly datasource: ProveedorDatasource) {}

    create(createProveedorDto: CreateProveedorDto): Promise<ProveedorEntity> {
        return this.datasource.create(createProveedorDto);
    }

    delete(id: number): Promise<ProveedorEntity> {
        return this.datasource.delete(id)
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<ProveedorEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<ProveedorEntity | null> {
        return this.datasource.getById(id);
    }

    update(updateProveedorDto: UpdateProveedorDto): Promise<ProveedorEntity | null> {
        return this.datasource.update(updateProveedorDto);
    }

}