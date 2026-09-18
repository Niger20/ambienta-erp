import { Router } from "express";
import { MovimientoCompraDatasourceImpl } from "../../infrastructure/datasource/movimientoCompra.datasource.impl";
import { MovimientoCompraRepositoryImpl } from "../../infrastructure/repositories/movimientoCompra.repository.impl";
import { MovimientoCompraController } from "./controller";

export class MovimientosComprasRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new MovimientoCompraDatasourceImpl();
        const repository = new MovimientoCompraRepositoryImpl(datasource);

        const controller = new MovimientoCompraController(repository);

        router.get('/', controller.getAll);
        router.get('/movimiento/:movimientocompraid', controller.getByMovimientoId);
        router.get('/compra/:compraid', controller.getByCompraId);
        router.post('/', controller.create);
        router.delete('/:movimientocompraid/:compraid', controller.delete);

        return router;
    }

}
