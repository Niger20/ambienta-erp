import { Router } from "express";
import { AuditoriaController } from "./controller";
import { AuditoriaDatasourceImpl } from "../../infrastructure/datasource/auditoria.datasource.impl";
import { AuditoriaRepositoryImpl } from "../../infrastructure/repositories/auditoria.repository.impl";

export class AuditoriaRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AuditoriaDatasourceImpl();
        const repository = new AuditoriaRepositoryImpl(datasource);
        const controller = new AuditoriaController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);

        return router;
    }
}
