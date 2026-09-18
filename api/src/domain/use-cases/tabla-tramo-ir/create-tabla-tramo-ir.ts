import { CreateTablaTramoIrDto } from "../../dtos/tabla-tramo-ir/create-tabla-tramo-ir.dto";
import { TablaTramoIrEntity } from "../../entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../repositories/tabla-tramo-ir.repository";

export interface CreateTablaTramoIrUseCase {
    execute(dto: CreateTablaTramoIrDto): Promise<TablaTramoIrEntity>;
}

export class CreateTablaTramoIr implements CreateTablaTramoIrUseCase {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    execute(dto: CreateTablaTramoIrDto): Promise<TablaTramoIrEntity> {
        return this.repository.create(dto);
    }
}
