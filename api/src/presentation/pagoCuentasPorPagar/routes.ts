import { Router } from "express";
import { PagoCuentaPorPagarDatasourceImpl } from "../../infrastructure/datasource/pagoCuentaPorPagar.datasource.impl";
import { PagoCuentaPorPagarRepositoryImpl } from "../../infrastructure/repositories/pagoCuentaPorPagar.repository.impl";
import { PagoCuentaPorPagarController } from "./controller";

export class PagoCuentasPorPagarRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new PagoCuentaPorPagarDatasourceImpl();
        const repository = new PagoCuentaPorPagarRepositoryImpl(datasource);

        const controller = new PagoCuentaPorPagarController(repository);

        router.get('/', controller.getAll);
        router.get('/pago/:pagoid', controller.getByPagoId);
        router.get('/cuenta-pagar/:cuentapagarid', controller.getByCuentaPagarId);
        router.post('/', controller.create);
        router.delete('/:pagoid/:cuentapagarid', controller.delete);

        return router;
    }

}
