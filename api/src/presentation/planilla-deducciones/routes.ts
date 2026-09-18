import { Router } from "express";
import { PlanillaDeduccionesController } from "./controller";
import { PlanillaDeduccionDatasourceImpl } from "../../infrastructure/datasource/planilla-deduccion.datasource.impl";
import { PlanillaDeduccionRepositoryImpl } from "../../infrastructure/repositories/planilla-deduccion.repository.impl";

export class PlanillaDeduccionesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PlanillaDeduccionDatasourceImpl();
        const repository = new PlanillaDeduccionRepositoryImpl(datasource);
        const controller = new PlanillaDeduccionesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
