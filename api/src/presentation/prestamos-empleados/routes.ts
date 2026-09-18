import { Router } from "express";
import { PrestamosEmpleadosController } from "./controller";
import { PrestamoEmpleadoDatasourceImpl } from "../../infrastructure/datasource/prestamo-empleado.datasource.impl";
import { PrestamoEmpleadoRepositoryImpl } from "../../infrastructure/repositories/prestamo-empleado.repository.impl";

export class PrestamosEmpleadosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PrestamoEmpleadoDatasourceImpl();
        const repository = new PrestamoEmpleadoRepositoryImpl(datasource);
        const controller = new PrestamosEmpleadosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
