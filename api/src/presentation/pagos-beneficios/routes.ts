import { Router } from "express";
import { PagosBeneficiosController } from "./controller";
import { PagoBeneficioDatasourceImpl } from "../../infrastructure/datasource/pago-beneficio.datasource.impl";
import { PagoBeneficioRepositoryImpl } from "../../infrastructure/repositories/pago-beneficio.repository.impl";

export class PagosBeneficiosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new PagoBeneficioDatasourceImpl();
        const repository = new PagoBeneficioRepositoryImpl(datasource);
        const controller = new PagosBeneficiosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
