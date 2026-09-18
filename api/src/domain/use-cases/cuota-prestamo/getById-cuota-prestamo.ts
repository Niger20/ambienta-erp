import { CuotaPrestamoEntity } from "../../entitites/cuota-prestamo.entity";
import { CuotaPrestamoRepository } from "../../repositories/cuota-prestamo.repository";

export interface GetByIdCuotaPrestamoUseCase {
    execute(id: number): Promise<CuotaPrestamoEntity | null>;
}

export class GetByIdCuotaPrestamo implements GetByIdCuotaPrestamoUseCase {
    constructor(private readonly repository: CuotaPrestamoRepository) {}

    execute(id: number): Promise<CuotaPrestamoEntity | null> {
        return this.repository.getById(id);
    }
}
