import { AbonoEntity } from "../../entitites/abono.entity";
import { UpdateAbonoDto } from "../../dtos";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface UpdateAbonoUseCase {
    execute(dto: UpdateAbonoDto): Promise<AbonoEntity>;
}

export class UpdateAbono implements UpdateAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(dto: UpdateAbonoDto): Promise<AbonoEntity> {
        return this.repository.update(dto);
    }
}
