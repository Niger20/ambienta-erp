import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreatePagoDto,
    PagoDatasource, PagoEntity,
    PagoRepository,
    UpdatePagoDto
} from "../../domain";


export class PagoRepositoryImpl implements PagoRepository {

    constructor(private readonly datasource: PagoDatasource) {}

    create(createPagoDto: CreatePagoDto): Promise<PagoEntity> {
        return this.datasource.create(createPagoDto);
    }

    delete(id: number): Promise<PagoEntity> {
        return this.datasource.delete(id)
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<PagoEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<PagoEntity | null> {
        return this.datasource.getById(id);
    }

    update(updatePagoDto: UpdatePagoDto): Promise<PagoEntity | null> {
        return this.datasource.update(updatePagoDto);
    }

}