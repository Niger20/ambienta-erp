import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { SesionEntity } from "../entitites/sesion.entity";
import { OpenSesionDto, CloseSesionDto } from "../dtos";


export abstract class SesionDatasource {

    abstract open(dto: OpenSesionDto): Promise<SesionEntity>;
    abstract close(dto: CloseSesionDto): Promise<SesionEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<SesionEntity>>;
    abstract getById(id: number): Promise<SesionEntity | null>;
    abstract getActive(usuarioid: number): Promise<SesionEntity | null>;
    abstract getReporteCierre(id: number): Promise<any>;

}
