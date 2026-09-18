import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    OpenSesionDto,
    CloseSesionDto,
    SesionDatasource,
    SesionEntity,
    SesionRepository,
} from "../../domain";


export class SesionRepositoryImpl implements SesionRepository {

    constructor(private readonly datasource: SesionDatasource) { }

    open(dto: OpenSesionDto): Promise<SesionEntity> {
        return this.datasource.open(dto);
    }

    close(dto: CloseSesionDto): Promise<SesionEntity> {
        return this.datasource.close(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<SesionEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<SesionEntity | null> {
        return this.datasource.getById(id);
    }

    getActive(usuarioid: number): Promise<SesionEntity | null> {
        return this.datasource.getActive(usuarioid);
    }

    getReporteCierre(id: number): Promise<any> {
        return this.datasource.getReporteCierre(id);
    }

}
