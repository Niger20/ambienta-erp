import { Router } from "express";
import { DeliveryDatasourceImpl } from "../../infrastructure/datasource/delivery.datasource.impl";
import { DeliveryRepositoryImpl } from "../../infrastructure/repositories/delivery.repository.impl";
import { DeliveryController } from "./controller";

export class DeliveryRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new DeliveryDatasourceImpl();
        const repository = new DeliveryRepositoryImpl(datasource);

        const deliveryController = new DeliveryController(repository);

        router.get('/', deliveryController.getDeliveries);
        router.get('/deactivated', deliveryController.getDeliveriesDeactivated);
        router.get('/:id', deliveryController.getDeliveryById);
        router.post('/', deliveryController.createDelivery);
        router.put('/:id', deliveryController.updateDelivery);
        router.delete('/:id', deliveryController.deleteDelivery);

        return router;
    }

}
