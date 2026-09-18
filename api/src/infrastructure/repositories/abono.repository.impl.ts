import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    CreateAbonoDto,
    AbonoDatasource,
    AbonoEntity,
    AbonoRepository,
    UpdateAbonoDto,
} from "../../domain";


export class AbonoRepositoryImpl implements AbonoRepository {

    constructor(private readonly datasource: AbonoDatasource) { }

    create(dto: CreateAbonoDto): Promise<AbonoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number): Promise<PaginatedResult<AbonoEntity>> {
        return this.datasource.getAll(page, limit);
    }

    getById(id: number): Promise<AbonoEntity | null> {
        return this.datasource.getById(id);
    }

    getByCuentaId(cuentaid: number): Promise<AbonoEntity[]> {
        return this.datasource.getByCuentaId(cuentaid);
    }

    update(dto: UpdateAbonoDto): Promise<AbonoEntity> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<AbonoEntity> {
        return this.datasource.delete(id);
    }

}
