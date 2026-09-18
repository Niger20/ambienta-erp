import { PaginatedResult } from "../dtos/shared/pagination.dto";
import {RepartidorEntity} from "../entitites/repartidor.entity";
import {CreateRepartidorDto, UpdateRepartidorDto} from "../dtos";


export abstract class RepartidorDataSource {

    abstract create( createRepartidorDto : CreateRepartidorDto): Promise<RepartidorEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<RepartidorEntity>>;
    abstract getById(id: number): Promise<RepartidorEntity|null>;
    abstract update( updateRepartidorDto : UpdateRepartidorDto): Promise<RepartidorEntity|null>;
    abstract delete(id: number): Promise<RepartidorEntity>;


}