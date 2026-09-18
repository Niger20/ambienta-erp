import { Router } from "express";
import { RegistroAsistenciaController } from "./controller";
import { RegistroAsistenciaDatasourceImpl } from "../../infrastructure/datasource/registro-asistencia.datasource.impl";
import { RegistroAsistenciaRepositoryImpl } from "../../infrastructure/repositories/registro-asistencia.repository.impl";

export class RegistroAsistenciaRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new RegistroAsistenciaDatasourceImpl();
        const repository = new RegistroAsistenciaRepositoryImpl(datasource);
        const controller = new RegistroAsistenciaController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
