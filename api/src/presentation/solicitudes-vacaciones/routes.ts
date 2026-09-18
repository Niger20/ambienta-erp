import { Router } from "express";
import { SolicitudesVacacionesController } from "./controller";
import { SolicitudVacacionesDatasourceImpl } from "../../infrastructure/datasource/solicitud-vacaciones.datasource.impl";
import { SolicitudVacacionesRepositoryImpl } from "../../infrastructure/repositories/solicitud-vacaciones.repository.impl";

export class SolicitudesVacacionesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new SolicitudVacacionesDatasourceImpl();
        const repository = new SolicitudVacacionesRepositoryImpl(datasource);
        const controller = new SolicitudesVacacionesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
