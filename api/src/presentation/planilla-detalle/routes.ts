import { Router } from "express";
import { PlanillaDetalleController } from "./controller";
import { PlanillaDetalleDatasourceImpl } from "../../infrastructure/datasource/planilla-detalle.datasource.impl";
import { PlanillaDetalleRepositoryImpl } from "../../infrastructure/repositories/planilla-detalle.repository.impl";

export class PlanillaDetalleRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PlanillaDetalleDatasourceImpl();
        const repository = new PlanillaDetalleRepositoryImpl(datasource);
        const controller = new PlanillaDetalleController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
