import { AbonoEntity } from "../../entitites/abono.entity";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface GetByIdAbonoUseCase {
    execute(id: number): Promise<AbonoEntity | null>;
}

export class GetByIdAbono implements GetByIdAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(id: number): Promise<AbonoEntity | null> {
        return this.repository.getById(id);
    }
}
