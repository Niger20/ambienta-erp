import { Router } from "express";
import { OrdenesCompraProductosController } from "./controller";
import { OrdenCompraProductoDatasourceImpl } from "../../infrastructure/datasource/orden-compra-producto.datasource.impl";
import { OrdenCompraProductoRepositoryImpl } from "../../infrastructure/repositories/orden-compra-producto.repository.impl";

export class OrdenesCompraProductosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new OrdenCompraProductoDatasourceImpl();
        const repository = new OrdenCompraProductoRepositoryImpl(datasource);
        const controller = new OrdenesCompraProductosController(repository);

        router.get('/', controller.getAll);
        router.get('/:ordencompraid/:productoid', controller.getById);
        router.post('/', controller.create);
        router.put('/:ordencompraid/:productoid', controller.update);
        router.delete('/:ordencompraid/:productoid', controller.delete);

        return router;
    }
}
