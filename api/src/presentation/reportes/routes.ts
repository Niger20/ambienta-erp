import { Router } from "express";
import { ReportesDatasourceImpl } from "../../infrastructure/datasource/reportes/reportes.datasource.impl";
import { ReportesRepositoryImpl } from "../../infrastructure/repositories/reportes/reportes.repository.impl";
import { ReportesController } from "./controller";

export class ReportesRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new ReportesDatasourceImpl();
        const repository = new ReportesRepositoryImpl(datasource);

        const controller = new ReportesController(repository);

        router.get('/utilidad-diaria', controller.getUtilidadDiaria);
        router.get('/utilidad-producto', controller.getUtilidadProducto);

        return router;
    }
}
