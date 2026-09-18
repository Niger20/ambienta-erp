import { Router } from "express";
import { GastoDatasourceImpl } from "../../infrastructure/datasource/gasto.datasource.impl";
import { GastoRepositoryImpl } from "../../infrastructure/repositories/gasto.repository.impl";
import { GastoController } from "./controller";

export class GastosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new GastoDatasourceImpl();
        const repository = new GastoRepositoryImpl(datasource);

        const gastoController = new GastoController(repository);

        router.get('/', gastoController.getGastos);
        router.get('/:id', gastoController.getGastoById);
        router.post('/', gastoController.createGasto);
        router.put('/:id', gastoController.updateGasto);
        router.delete('/:id', gastoController.deleteGasto);

        return router;
    }

}
