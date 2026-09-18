import {Router} from "express";
import {PagoDatasourceImpl} from "../../infrastructure/datasource/pago.datasource.impl";
import {PagoRepositoryImpl} from "../../infrastructure/repositories/pago.repository.impl";
import {PagoController} from "./controller";

export class PagosRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new PagoDatasourceImpl();
        const repository = new PagoRepositoryImpl(datasource);

        const pagoController = new PagoController(repository);

        router.get('/', pagoController.getPago);
        router.get('/deactivated', pagoController.getPagoDeactivated);
        router.get('/:id', pagoController.getPagoById);
        router.post('/', pagoController.createPago);
        router.put('/:id', pagoController.updatePago);
        router.delete('/:id', pagoController.deletePago);

        return router
    }

}