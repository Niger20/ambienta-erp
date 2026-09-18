import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { PagoGastoEntity } from "../entitites/pagoGasto.entity";
import { CreatePagoGastoDto } from "../dtos";


export abstract class PagoGastoDatasource {

    abstract create(dto: CreatePagoGastoDto): Promise<PagoGastoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoGastoEntity>>;
    abstract getByPagoId(pagoid: number): Promise<PagoGastoEntity[]>;
    abstract getByGastoId(gastoid: number): Promise<PagoGastoEntity[]>;
    abstract delete(pagoid: number, gastoid: number): Promise<PagoGastoEntity>;

}
