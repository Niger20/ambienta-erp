import { Router } from "express";
import { AcumuladoDecimoPrimerMesController } from "./controller";
import { AcumuladoDecimoPrimerMesDatasourceImpl } from "../../infrastructure/datasource/acumulado-decimo-primer-mes.datasource.impl";
import { AcumuladoDecimoPrimerMesRepositoryImpl } from "../../infrastructure/repositories/acumulado-decimo-primer-mes.repository.impl";

export class AcumuladoDecimoPrimerMesRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AcumuladoDecimoPrimerMesDatasourceImpl();
        const repository = new AcumuladoDecimoPrimerMesRepositoryImpl(datasource);
        const controller = new AcumuladoDecimoPrimerMesController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
