import { Router } from "express";
import { CompraProductoDatasourceImpl } from "../../infrastructure/datasource/compraProducto.datasource.impl";
import { CompraProductoRepositoryImpl } from "../../infrastructure/repositories/compraProducto.repository.impl";
import { CompraProductoController } from "./controller";

export class ComprasProductosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new CompraProductoDatasourceImpl();
        const repository = new CompraProductoRepositoryImpl(datasource);

        const controller = new CompraProductoController(repository);

        router.get('/', controller.getAll);
        router.get('/compra/:compraid', controller.getByCompraId);
        router.post('/', controller.create);
        router.delete('/:compraid/:productoid', controller.delete);

        return router;
    }

}
