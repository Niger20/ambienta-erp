import { Router } from "express";
import { FeriadosNacionalesController } from "./controller";
import { FeriadoNacionalDatasourceImpl } from "../../infrastructure/datasource/feriado-nacional.datasource.impl";
import { FeriadoNacionalRepositoryImpl } from "../../infrastructure/repositories/feriado-nacional.repository.impl";

export class FeriadosNacionalesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new FeriadoNacionalDatasourceImpl();
        const repository = new FeriadoNacionalRepositoryImpl(datasource);
        const controller = new FeriadosNacionalesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
