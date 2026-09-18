import {Router} from "express";
import {RepartidorDatasourceImpl} from "../../infrastructure/datasource/repartidor.datasource.impl";
import {RepartidorRepositoryImpl} from "../../infrastructure/repositories/repartidor.repository.impl";
import {RepartidorController} from "./controller";

export class RepartidorRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new RepartidorDatasourceImpl();
        const repository = new RepartidorRepositoryImpl(datasource);

        const repartidorController = new RepartidorController(repository);

        router.get('/', repartidorController.getRepartidor);
        router.get('/:id', repartidorController.getRepartidorById);
        router.post('/', repartidorController.createRepartidor);
        router.put('/:id', repartidorController.updateRepartidor);
        router.delete('/:id', repartidorController.deleteRepartidor);

        return router
    }

}