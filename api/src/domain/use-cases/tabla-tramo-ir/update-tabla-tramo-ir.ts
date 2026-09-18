import { UpdateTablaTramoIrDto } from "../../dtos/tabla-tramo-ir/update-tabla-tramo-ir.dto";
import { TablaTramoIrEntity } from "../../entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../repositories/tabla-tramo-ir.repository";

export interface UpdateTablaTramoIrUseCase {
    execute(dto: UpdateTablaTramoIrDto): Promise<TablaTramoIrEntity | null>;
}

export class UpdateTablaTramoIr implements UpdateTablaTramoIrUseCase {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    execute(dto: UpdateTablaTramoIrDto): Promise<TablaTramoIrEntity | null> {
        return this.repository.update(dto);
    }
}
