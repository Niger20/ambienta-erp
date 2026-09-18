import { Router } from "express";
import { MovimientoInventarioDatasourceImpl } from "../../infrastructure/datasource/movimientoInventario.datasource.impl";
import { MovimientoInventarioRepositoryImpl } from "../../infrastructure/repositories/movimientoInventario.repository.impl";
import { MovimientoInventarioController } from "./controller";

export class MovimientosInventarioRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new MovimientoInventarioDatasourceImpl();
        const repository = new MovimientoInventarioRepositoryImpl(datasource);

        const controller = new MovimientoInventarioController(repository);

        router.get('/', controller.getAll);
        router.get('/producto/:productoid', controller.getByProductoId);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.delete('/:id', controller.delete);

        return router;
    }

}
