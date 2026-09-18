import { Router } from "express";
import { AcumuladoIndemnizacionController } from "./controller";
import { AcumuladoIndemnizacionDatasourceImpl } from "../../infrastructure/datasource/acumulado-indemnizacion.datasource.impl";
import { AcumuladoIndemnizacionRepositoryImpl } from "../../infrastructure/repositories/acumulado-indemnizacion.repository.impl";

export class AcumuladoIndemnizacionRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new AcumuladoIndemnizacionDatasourceImpl();
        const repository = new AcumuladoIndemnizacionRepositoryImpl(datasource);
        const controller = new AcumuladoIndemnizacionController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
