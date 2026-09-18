import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateCompraDto,
    CompraDatasource,
    CompraEntity,
    CompraRepository,
    UpdateCompraDto
} from "../../domain";


export class CompraRepositoryImpl implements CompraRepository {

    constructor(private readonly datasource: CompraDatasource) { }

    create(dto: CreateCompraDto): Promise<CompraEntity> {
        return this.datasource.create(dto);
    }

    delete(id: number): Promise<CompraEntity> {
        return this.datasource.delete(id);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<CompraEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<CompraEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<CompraEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateCompraDto): Promise<CompraEntity | null> {
        return this.datasource.update(dto);
    }

    getPropuesta(proveedorId: number): Promise<any> {
        return this.datasource.getPropuesta(proveedorId);
    }

    getPropuestaGlobal(): Promise<any> {
        return this.datasource.getPropuestaGlobal();
    }
}
