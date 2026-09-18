import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePrestamoEmpleadoDto } from "../../domain/dtos/prestamo-empleado/create-prestamo-empleado.dto";
import { UpdatePrestamoEmpleadoDto } from "../../domain/dtos/prestamo-empleado/update-prestamo-empleado.dto";
import { PrestamoEmpleadoDatasource } from "../../domain/datasources/prestamo-empleado.datasource";
import { PrestamoEmpleadoEntity } from "../../domain/entitites/prestamo-empleado.entity";
import { PrestamoEmpleadoRepository } from "../../domain/repositories/prestamo-empleado.repository";

export class PrestamoEmpleadoRepositoryImpl implements PrestamoEmpleadoRepository {
    constructor(private readonly datasource: PrestamoEmpleadoDatasource) {}

    create(dto: CreatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, empleadoid?: number, estado?: string): Promise<PaginatedResult<PrestamoEmpleadoEntity>> {
        return this.datasource.getAll(page, limit, empleadoid, estado);
    }

    getById(id: number): Promise<PrestamoEmpleadoEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePrestamoEmpleadoDto): Promise<PrestamoEmpleadoEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PrestamoEmpleadoEntity> {
        return this.datasource.delete(id);
    }
}
