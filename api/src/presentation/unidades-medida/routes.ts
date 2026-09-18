import { Router } from "express";
import { UnidadesMedidaController } from "./controller";
import { UnidadMedidaDatasourceImpl } from "../../infrastructure/datasource/unidad-medida.datasource.impl";
import { UnidadMedidaRepositoryImpl } from "../../infrastructure/repositories/unidad-medida.repository.impl";

export class UnidadesMedidaRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new UnidadMedidaDatasourceImpl();
        const repository = new UnidadMedidaRepositoryImpl(datasource);
        const controller = new UnidadesMedidaController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
