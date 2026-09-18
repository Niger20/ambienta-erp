import { Router } from "express";
import { MermasController } from "./controller";
import { MermaDatasourceImpl } from "../../infrastructure/datasource/merma.datasource.impl";
import { MermaRepositoryImpl } from "../../infrastructure/repositories/merma.repository.impl";

export class MermasRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new MermaDatasourceImpl();
        const repository = new MermaRepositoryImpl(datasource);
        const controller = new MermasController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
