import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateVentaDto,
    VentaDatasource,
    VentaEntity,
    VentaRepository,
    UpdateVentaDto
} from "../../domain";


export class VentaRepositoryImpl implements VentaRepository {

    constructor(private readonly datasource: VentaDatasource) { }

    create(dto: CreateVentaDto): Promise<VentaEntity> {
        return this.datasource.create(dto);
    }

    delete(id: number): Promise<VentaEntity> {
        return this.datasource.delete(id);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<VentaEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getDeactivated(): Promise<VentaEntity[]> {
        return this.datasource.getDeactivated();
    }

    getById(id: number): Promise<VentaEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdateVentaDto): Promise<VentaEntity | null> {
        return this.datasource.update(dto);
    }

}
