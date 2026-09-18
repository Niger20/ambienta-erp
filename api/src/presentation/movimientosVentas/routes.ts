import { Router } from "express";
import { MovimientoVentaDatasourceImpl } from "../../infrastructure/datasource/movimientoVenta.datasource.impl";
import { MovimientoVentaRepositoryImpl } from "../../infrastructure/repositories/movimientoVenta.repository.impl";
import { MovimientoVentaController } from "./controller";

export class MovimientosVentasRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new MovimientoVentaDatasourceImpl();
        const repository = new MovimientoVentaRepositoryImpl(datasource);

        const controller = new MovimientoVentaController(repository);

        router.get('/', controller.getAll);
        router.get('/movimiento/:movimeintoventaid', controller.getByMovimientoId);
        router.get('/venta/:ventaid', controller.getByVentaId);
        router.post('/', controller.create);
        router.delete('/:movimeintoventaid/:ventaid', controller.delete);

        return router;
    }

}
