import { Router } from "express";
import { CategoriasClientesController } from "./controller";
import { CategoriaClienteDatasourceImpl } from "../../infrastructure/datasource/categoria-cliente.datasource.impl";
import { CategoriaClienteRepositoryImpl } from "../../infrastructure/repositories/categoria-cliente.repository.impl";

export class CategoriasClientesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new CategoriaClienteDatasourceImpl();
        const repository = new CategoriaClienteRepositoryImpl(datasource);
        const controller = new CategoriasClientesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
