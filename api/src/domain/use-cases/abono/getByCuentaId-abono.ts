import { AbonoEntity } from "../../entitites/abono.entity";
import { AbonoRepository } from "../../repositories/abono.repository";

export interface GetByCuentaIdAbonoUseCase {
    execute(cuentaid: number): Promise<AbonoEntity[]>;
}

export class GetByCuentaIdAbono implements GetByCuentaIdAbonoUseCase {
    constructor(private readonly repository: AbonoRepository) { }
    execute(cuentaid: number): Promise<AbonoEntity[]> {
        return this.repository.getByCuentaId(cuentaid);
    }
}
