import { Router } from "express";
import { VentaDatasourceImpl } from "../../infrastructure/datasource/venta.datasource.impl";
import { VentaRepositoryImpl } from "../../infrastructure/repositories/venta.repository.impl";
import { VentaController } from "./controller";

export class VentasRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new VentaDatasourceImpl();
        const repository = new VentaRepositoryImpl(datasource);

        const ventaController = new VentaController(repository);

        router.get('/', ventaController.getVentas);
        router.get('/deactivated', ventaController.getVentasDeactivated);
        router.get('/:id', ventaController.getVentaById);
        router.post('/', ventaController.createVenta);
        router.put('/:id', ventaController.updateVenta);
        router.delete('/:id', ventaController.deleteVenta);

        return router;
    }

}
