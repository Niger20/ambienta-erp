import { Router } from "express";
import { VentaDeliveryDatasourceImpl } from "../../infrastructure/datasource/ventaDelivery.datasource.impl";
import { VentaDeliveryRepositoryImpl } from "../../infrastructure/repositories/ventaDelivery.repository.impl";
import { VentaDeliveryController } from "./controller";

export class VentaDeliveryRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new VentaDeliveryDatasourceImpl();
        const repository = new VentaDeliveryRepositoryImpl(datasource);

        const controller = new VentaDeliveryController(repository);

        router.get('/', controller.getAll);
        router.get('/venta/:ventaid', controller.getByVentaId);
        router.get('/delivery/:deliveryid', controller.getByDeliveryId);
        router.post('/', controller.create);
        router.delete('/:ventaid/:deliveryid', controller.delete);

        return router;
    }

}
