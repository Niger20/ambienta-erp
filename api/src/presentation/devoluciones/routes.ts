import { Router } from "express";
import { DevolucionesController } from "./controller";
import { DevolucionDatasourceImpl } from "../../infrastructure/datasource/devolucion.datasource.impl";
import { DevolucionRepositoryImpl } from "../../infrastructure/repositories/devolucion.repository.impl";

export class DevolucionesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new DevolucionDatasourceImpl();
        const repository = new DevolucionRepositoryImpl(datasource);
        const controller = new DevolucionesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
