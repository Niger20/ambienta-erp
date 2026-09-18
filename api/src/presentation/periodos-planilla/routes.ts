import { Router } from "express";
import { PeriodosPlanillaController } from "./controller";
import { PeriodoPlanillaDatasourceImpl } from "../../infrastructure/datasource/periodo-planilla.datasource.impl";
import { PeriodoPlanillaRepositoryImpl } from "../../infrastructure/repositories/periodo-planilla.repository.impl";

export class PeriodosPlanillaRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PeriodoPlanillaDatasourceImpl();
        const repository = new PeriodoPlanillaRepositoryImpl(datasource);
        const controller = new PeriodosPlanillaController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
