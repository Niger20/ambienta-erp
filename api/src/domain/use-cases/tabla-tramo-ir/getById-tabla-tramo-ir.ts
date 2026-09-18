import { TablaTramoIrEntity } from "../../entitites/tabla-tramo-ir.entity";
import { TablaTramoIrRepository } from "../../repositories/tabla-tramo-ir.repository";

export interface GetByIdTablaTramoIrUseCase {
    execute(id: number): Promise<TablaTramoIrEntity | null>;
}

export class GetByIdTablaTramoIr implements GetByIdTablaTramoIrUseCase {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    execute(id: number): Promise<TablaTramoIrEntity | null> {
        return this.repository.getById(id);
    }
}
