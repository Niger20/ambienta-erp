import { Router } from "express";
import { ConfiguracionInssController } from "./controller";
import { ConfiguracionInssDatasourceImpl } from "../../infrastructure/datasource/configuracion-inss.datasource.impl";
import { ConfiguracionInssRepositoryImpl } from "../../infrastructure/repositories/configuracion-inss.repository.impl";

export class ConfiguracionInssRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new ConfiguracionInssDatasourceImpl();
        const repository = new ConfiguracionInssRepositoryImpl(datasource);
        const controller = new ConfiguracionInssController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
