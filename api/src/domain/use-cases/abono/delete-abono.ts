import { AbonoEntity } from "../../entitites/abono.entity";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface DeleteAbonoUseCase {
    execute(id: number): Promise<AbonoEntity>;
}

export class DeleteAbono implements DeleteAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(id: number): Promise<AbonoEntity> {
        return this.repository.delete(id);
    }
}
