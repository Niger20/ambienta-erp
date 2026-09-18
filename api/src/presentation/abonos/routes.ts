import { Router } from "express";
import { AbonoDatasourceImpl } from "../../infrastructure/datasource/abono.datasource.impl";
import { AbonoRepositoryImpl } from "../../infrastructure/repositories/abono.repository.impl";
import { AbonoController } from "./controller";

export class AbonosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new AbonoDatasourceImpl();
        const repository = new AbonoRepositoryImpl(datasource);

        const controller = new AbonoController(repository);

        router.get('/', controller.getAll);
        router.get('/cuenta/:cuentaid', controller.getByCuentaId);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }

}
