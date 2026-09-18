import { Router } from "express";
import { VentaPagosController } from "./controller";
import { VentaPagoDatasourceImpl } from "../../infrastructure/datasource/venta-pago.datasource.impl";
import { VentaPagoRepositoryImpl } from "../../infrastructure/repositories/venta-pago.repository.impl";

export class VentaPagosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new VentaPagoDatasourceImpl();
        const repository = new VentaPagoRepositoryImpl(datasource);
        const controller = new VentaPagosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
