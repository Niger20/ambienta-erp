import { Router } from "express";
import { TablaTramoIrController } from "./controller";
import { TablaTramoIrDatasourceImpl } from "../../infrastructure/datasource/tabla-tramo-ir.datasource.impl";
import { TablaTramoIrRepositoryImpl } from "../../infrastructure/repositories/tabla-tramo-ir.repository.impl";

export class TablaTramoIrRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new TablaTramoIrDatasourceImpl();
        const repository = new TablaTramoIrRepositoryImpl(datasource);
        const controller = new TablaTramoIrController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
