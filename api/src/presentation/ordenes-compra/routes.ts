import { Router } from "express";
import { OrdenesCompraController } from "./controller";
import { OrdenCompraDatasourceImpl } from "../../infrastructure/datasource/orden-compra.datasource.impl";
import { OrdenCompraRepositoryImpl } from "../../infrastructure/repositories/orden-compra.repository.impl";

export class OrdenesCompraRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new OrdenCompraDatasourceImpl();
        const repository = new OrdenCompraRepositoryImpl(datasource);
        const controller = new OrdenesCompraController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
