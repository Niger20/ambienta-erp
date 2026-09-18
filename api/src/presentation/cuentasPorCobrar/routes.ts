import { Router } from "express";
import { CuentaPorCobrarDatasourceImpl } from "../../infrastructure/datasource/cuentaPorCobrar.datasource.impl";
import { CuentaPorCobrarRepositoryImpl } from "../../infrastructure/repositories/cuentaPorCobrar.repository.impl";
import { CuentaPorCobrarController } from "./controller";

export class CuentasPorCobrarRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new CuentaPorCobrarDatasourceImpl();
        const repository = new CuentaPorCobrarRepositoryImpl(datasource);

        const controller = new CuentaPorCobrarController(repository);

        router.get('/', controller.getAll);
        router.get('/deactivated', controller.getDeactivated);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }

}
