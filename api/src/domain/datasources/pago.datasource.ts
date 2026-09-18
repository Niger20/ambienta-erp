import { PaginatedResult } from "../dtos/shared/pagination.dto";


import {PagoEntity} from "../entitites/pago.entity";
import {CreatePagoDto, UpdatePagoDto} from "../dtos";


export abstract class PagoDatasource {

    abstract create( create : CreatePagoDto): Promise<PagoEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<PagoEntity>>;
    abstract getById(id: number): Promise<PagoEntity|null>;
    abstract update( UpdatePagoDto : UpdatePagoDto): Promise<PagoEntity|null>;
    abstract delete(id: number): Promise<PagoEntity>;
    abstract getDeactivated(): Promise<PagoEntity[]>;

}