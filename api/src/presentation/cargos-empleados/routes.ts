import { Router } from "express";
import { CargosEmpleadosController } from "./controller";
import { CargoEmpleadoDatasourceImpl } from "../../infrastructure/datasource/cargo-empleado.datasource.impl";
import { CargoEmpleadoRepositoryImpl } from "../../infrastructure/repositories/cargo-empleado.repository.impl";

export class CargosEmpleadosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new CargoEmpleadoDatasourceImpl();
        const repository = new CargoEmpleadoRepositoryImpl(datasource);
        const controller = new CargosEmpleadosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
