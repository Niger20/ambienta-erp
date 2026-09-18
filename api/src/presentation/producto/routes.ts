import { Router } from "express";
import { ProductoDatasourceImpl } from "../../infrastructure/datasource/producto.datasource.impl";
import { ProductoRepositoryImpl } from "../../infrastructure/repositories/producto.repository.impl";
import { ProductoController } from "./controller";

export class ProductosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new ProductoDatasourceImpl();
        const repository = new ProductoRepositoryImpl(datasource);

        const productoController = new ProductoController(repository);

        router.get('/', productoController.getProducto);
        router.get('/deactivated', productoController.getProductoDeactivated);
        router.get('/search', productoController.searchProducto);
        router.get('/barcode/:codigobarra', productoController.getProductoByBarcode);
        router.get('/:id', productoController.getProductoById);
        router.post('/', productoController.createProducto);
        router.put('/:id', productoController.updateProducto);
        router.delete('/:id', productoController.deleteProducto);
        router.post('/recalculate-stock-minimo', productoController.recalculateStockMinimo);

        return router
    }

}