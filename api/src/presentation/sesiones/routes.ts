import { Router } from "express";
import { SesionDatasourceImpl } from "../../infrastructure/datasource/sesion.datasource.impl";
import { SesionRepositoryImpl } from "../../infrastructure/repositories/sesion.repository.impl";
import { SesionController } from "./controller";

export class SesionesRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new SesionDatasourceImpl();
        const repository = new SesionRepositoryImpl(datasource);

        const sesionController = new SesionController(repository);

        router.get('/', sesionController.getSesiones);
        router.get('/active', sesionController.getActiveSesion);
        router.get('/:id/reporte-cierre', sesionController.getReporteCierre);
        router.get('/:id', sesionController.getSesionById);
        router.post('/', sesionController.openSesion);
        router.put('/close/:id', sesionController.closeSesion);

        return router;
    }

}
