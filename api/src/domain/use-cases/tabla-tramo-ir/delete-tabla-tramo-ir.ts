import { TablaTramoIrEntity } from "../../entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../repositories/tabla-tramo-ir.repository";

export interface DeleteTablaTramoIrUseCase {
    execute(id: number): Promise<TablaTramoIrEntity>;
}

export class DeleteTablaTramoIr implements DeleteTablaTramoIrUseCase {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    execute(id: number): Promise<TablaTramoIrEntity> {
        return this.repository.delete(id);
    }
}
