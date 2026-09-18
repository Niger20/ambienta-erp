import { Router } from "express";
import { HistorialSalariosController } from "./controller";
import { HistorialSalarioDatasourceImpl } from "../../infrastructure/datasource/historial-salario.datasource.impl";
import { HistorialSalarioRepositoryImpl } from "../../infrastructure/repositories/historial-salario.repository.impl";

export class HistorialSalariosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new HistorialSalarioDatasourceImpl();
        const repository = new HistorialSalarioRepositoryImpl(datasource);
        const controller = new HistorialSalariosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
