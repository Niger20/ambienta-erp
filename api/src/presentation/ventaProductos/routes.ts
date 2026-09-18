import { Router } from "express";
import { VentaProductoDatasourceImpl } from "../../infrastructure/datasource/ventaProducto.datasource.impl";
import { VentaProductoRepositoryImpl } from "../../infrastructure/repositories/ventaProducto.repository.impl";
import { VentaProductoController } from "./controller";

export class VentaProductoRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new VentaProductoDatasourceImpl();
        const repository = new VentaProductoRepositoryImpl(datasource);

        const controller = new VentaProductoController(repository);

        router.get('/', controller.getAll);
        router.get('/venta/:ventaid', controller.getByVentaId);
        router.post('/', controller.create);
        router.delete('/:ventaid/:productoid', controller.delete);

        return router;
    }

}
