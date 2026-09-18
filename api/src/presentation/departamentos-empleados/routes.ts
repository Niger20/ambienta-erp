import { Router } from "express";
import { DepartamentosEmpleadosController } from "./controller";
import { DepartamentoEmpleadoDatasourceImpl } from "../../infrastructure/datasource/departamento-empleado.datasource.impl";
import { DepartamentoEmpleadoRepositoryImpl } from "../../infrastructure/repositories/departamento-empleado.repository.impl";

export class DepartamentosEmpleadosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new DepartamentoEmpleadoDatasourceImpl();
        const repository = new DepartamentoEmpleadoRepositoryImpl(datasource);
        const controller = new DepartamentosEmpleadosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
