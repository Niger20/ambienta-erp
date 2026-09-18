import { Router } from "express";
import { AnticiposSalarioController } from "./controller";
import { AnticipoSalarioDatasourceImpl } from "../../infrastructure/datasource/anticipo-salario.datasource.impl";
import { AnticipoSalarioRepositoryImpl } from "../../infrastructure/repositories/anticipo-salario.repository.impl";

export class AnticiposSalarioRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AnticipoSalarioDatasourceImpl();
        const repository = new AnticipoSalarioRepositoryImpl(datasource);
        const controller = new AnticiposSalarioController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
