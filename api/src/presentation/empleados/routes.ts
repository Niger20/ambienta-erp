import { Router } from "express";
import { EmpleadosController } from "./controller";
import { EmpleadoDatasourceImpl } from "../../infrastructure/datasource/empleado.datasource.impl";
import { EmpleadoRepositoryImpl } from "../../infrastructure/repositories/empleado.repository.impl";

export class EmpleadosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new EmpleadoDatasourceImpl();
        const repository = new EmpleadoRepositoryImpl(datasource);
        const controller = new EmpleadosController(repository);

        router.get('/', controller.getAll);
        router.get('/deactivated', controller.getDeactivated);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
