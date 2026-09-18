import { Router } from "express";
import { AcumuladoVacacionesController } from "./controller";
import { AcumuladoVacacionesDatasourceImpl } from "../../infrastructure/datasource/acumulado-vacaciones.datasource.impl";
import { AcumuladoVacacionesRepositoryImpl } from "../../infrastructure/repositories/acumulado-vacaciones.repository.impl";

export class AcumuladoVacacionesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AcumuladoVacacionesDatasourceImpl();
        const repository = new AcumuladoVacacionesRepositoryImpl(datasource);
        const controller = new AcumuladoVacacionesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
