import { Router } from "express";
import { CuotasPrestamosController } from "./controller";
import { CuotaPrestamoDatasourceImpl } from "../../infrastructure/datasource/cuota-prestamo.datasource.impl";
import { CuotaPrestamoRepositoryImpl } from "../../infrastructure/repositories/cuota-prestamo.repository.impl";

export class CuotasPrestamosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new CuotaPrestamoDatasourceImpl();
        const repository = new CuotaPrestamoRepositoryImpl(datasource);
        const controller = new CuotasPrestamosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
