import { Router } from "express";
import { LiquidacionesEmpleadosController } from "./controller";
import { LiquidacionEmpleadoDatasourceImpl } from "../../infrastructure/datasource/liquidacion-empleado.datasource.impl";
import { LiquidacionEmpleadoRepositoryImpl } from "../../infrastructure/repositories/liquidacion-empleado.repository.impl";

export class LiquidacionesEmpleadosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new LiquidacionEmpleadoDatasourceImpl();
        const repository = new LiquidacionEmpleadoRepositoryImpl(datasource);
        const controller = new LiquidacionesEmpleadosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
