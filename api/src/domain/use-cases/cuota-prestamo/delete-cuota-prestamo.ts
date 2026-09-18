import { CuotaPrestamoEntity } from "../../entitites/cuota-prestamo.entity";
import { CuotaPrestamoRepository } from "../../repositories/cuota-prestamo.repository";

export interface DeleteCuotaPrestamoUseCase {
    execute(id: number): Promise<CuotaPrestamoEntity>;
}

export class DeleteCuotaPrestamo implements DeleteCuotaPrestamoUseCase {
    constructor(private readonly repository: CuotaPrestamoRepository) {}

    execute(id: number): Promise<CuotaPrestamoEntity> {
        return this.repository.delete(id);
    }
}
