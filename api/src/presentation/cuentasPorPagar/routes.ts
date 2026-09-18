import { Router } from "express";
import { CuentaPorPagarDatasourceImpl } from "../../infrastructure/datasource/cuentaPorPagar.datasource.impl";
import { CuentaPorPagarRepositoryImpl } from "../../infrastructure/repositories/cuentaPorPagar.repository.impl";
import { CuentaPorPagarController } from "./controller";

export class CuentasPorPagarRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new CuentaPorPagarDatasourceImpl();
        const repository = new CuentaPorPagarRepositoryImpl(datasource);

        const controller = new CuentaPorPagarController(repository);

        router.get('/', controller.getAll);
        router.get('/deactivated', controller.getDeactivated);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }

}
