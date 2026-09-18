import { AbonoEntity } from "../../entitites/abono.entity";
import { CreateAbonoDto } from "../../dtos";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface CreateAbonoUseCase {
    execute(dto: CreateAbonoDto): Promise<AbonoEntity>;
}

export class CreateAbono implements CreateAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(dto: CreateAbonoDto): Promise<AbonoEntity> {
        return this.repository.create(dto);
    }
}
