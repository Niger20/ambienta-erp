import { CreateCuotaPrestamoDto } from "../../dtos/cuota-prestamo/create-cuota-prestamo.dto";
import { CuotaPrestamoEntity } from "../../entitites/cuota-prestamo.entity";
import { CuotaPrestamoRepository } from "../../repositories/cuota-prestamo.repository";

export interface CreateCuotaPrestamoUseCase {
    execute(dto: CreateCuotaPrestamoDto): Promise<CuotaPrestamoEntity>;
}

export class CreateCuotaPrestamo implements CreateCuotaPrestamoUseCase {
    constructor(private readonly repository: CuotaPrestamoRepository) {}

    execute(dto: CreateCuotaPrestamoDto): Promise<CuotaPrestamoEntity> {
        return this.repository.create(dto);
    }
}
