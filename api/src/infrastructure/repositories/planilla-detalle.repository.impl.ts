import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import { CreatePlanillaDetalleDto } from "../../domain/dtos/planilla-detalle/create-planilla-detalle.dto";
import { UpdatePlanillaDetalleDto } from "../../domain/dtos/planilla-detalle/update-planilla-detalle.dto";
import { PlanillaDetalleDatasource } from "../../domain/datasources/planilla-detalle.datasource";
import { PlanillaDetalleEntity } from "../../domain/entitites/planilla-detalle.entity";
import { PlanillaDetalleRepository } from "../../domain/repositories/planilla-detalle.repository";

export class PlanillaDetalleRepositoryImpl implements PlanillaDetalleRepository {
    constructor(private readonly datasource: PlanillaDetalleDatasource) {}

    create(dto: CreatePlanillaDetalleDto): Promise<PlanillaDetalleEntity> {
        return this.datasource.create(dto);
    }

    getAll(page?: number, limit?: number, periodoid?: number, empleadoid?: number): Promise<PaginatedResult<PlanillaDetalleEntity>> {
        return this.datasource.getAll(page, limit, periodoid, empleadoid);
    }

    getById(id: number): Promise<PlanillaDetalleEntity | null> {
        return this.datasource.getById(id);
    }

    update(dto: UpdatePlanillaDetalleDto): Promise<PlanillaDetalleEntity | null> {
        return this.datasource.update(dto);
    }

    delete(id: number): Promise<PlanillaDetalleEntity> {
        return this.datasource.delete(id);
    }
}
