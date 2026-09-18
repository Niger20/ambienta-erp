import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { CompraEntity } from "../entitites/compra.entity";
import { CreateCompraDto, UpdateCompraDto } from "../dtos";


export abstract class CompraDatasource {

    abstract create(dto: CreateCompraDto): Promise<CompraEntity>;
    abstract getAll(page?: number, limit?: number): Promise<PaginatedResult<CompraEntity>>;
    abstract getDeactivated(): Promise<CompraEntity[]>;
    abstract getById(id: number): Promise<CompraEntity | null>;
    abstract update(dto: UpdateCompraDto): Promise<CompraEntity | null>;
    abstract delete(id: number): Promise<CompraEntity>;
    abstract getPropuesta(proveedorId: number): Promise<any>;
    abstract getPropuestaGlobal(): Promise<any>;
}
