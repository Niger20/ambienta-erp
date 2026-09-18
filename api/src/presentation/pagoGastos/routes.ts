import { Router } from "express";
import { PagoGastoDatasourceImpl } from "../../infrastructure/datasource/pagoGasto.datasource.impl";
import { PagoGastoRepositoryImpl } from "../../infrastructure/repositories/pagoGasto.repository.impl";
import { PagoGastoController } from "./controller";

export class PagoGastosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new PagoGastoDatasourceImpl();
        const repository = new PagoGastoRepositoryImpl(datasource);

        const controller = new PagoGastoController(repository);

        router.get('/', controller.getAll);
        router.get('/pago/:pagoid', controller.getByPagoId);
        router.get('/gasto/:gastoid', controller.getByGastoId);
        router.post('/', controller.create);
        router.delete('/:pagoid/:gastoid', controller.delete);

        return router;
    }

}
