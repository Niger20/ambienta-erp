import { Router } from "express";
import { CompraDatasourceImpl } from "../../infrastructure/datasource/compra.datasource.impl";
import { CompraRepositoryImpl } from "../../infrastructure/repositories/compra.repository.impl";
import { CompraController } from "./controller";

export class ComprasRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new CompraDatasourceImpl();
        const repository = new CompraRepositoryImpl(datasource);

        const controller = new CompraController(repository);

        router.get('/', controller.getCompras);
        router.get('/deactivated', controller.getComprasDeactivated);
        router.get('/propuesta-global', controller.getPropuestaPedidoGlobal);
        router.get('/propuesta/:proveedorId', controller.getPropuestaPedido);
        router.get('/:id', controller.getCompraById);
        router.post('/', controller.createCompra);
        router.put('/:id', controller.updateCompra);
        router.delete('/:id', controller.deleteCompra);

        return router;
    }

}
