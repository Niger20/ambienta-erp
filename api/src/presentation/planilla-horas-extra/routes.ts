import { Router } from "express";
import { PlanillaHorasExtraController } from "./controller";
import { PlanillaHoraExtraDatasourceImpl } from "../../infrastructure/datasource/planilla-hora-extra.datasource.impl";
import { PlanillaHoraExtraRepositoryImpl } from "../../infrastructure/repositories/planilla-hora-extra.repository.impl";

export class PlanillaHorasExtraRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PlanillaHoraExtraDatasourceImpl();
        const repository = new PlanillaHoraExtraRepositoryImpl(datasource);
        const controller = new PlanillaHorasExtraController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
