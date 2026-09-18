import { Router } from "express";
import { CostosAdicionalesComprasController } from "./controller";
import { CostoAdicionalCompraDatasourceImpl } from "../../infrastructure/datasource/costo-adicional-compra.datasource.impl";
import { CostoAdicionalCompraRepositoryImpl } from "../../infrastructure/repositories/costo-adicional-compra.repository.impl";

export class CostosAdicionalesComprasRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new CostoAdicionalCompraDatasourceImpl();
        const repository = new CostoAdicionalCompraRepositoryImpl(datasource);
        const controller = new CostosAdicionalesComprasController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
