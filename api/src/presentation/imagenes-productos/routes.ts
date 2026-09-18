import { Router } from "express";
import { ImagenesProductosController } from "./controller";
import { ImagenProductoDatasourceImpl } from "../../infrastructure/datasource/imagen-producto.datasource.impl";
import { ImagenProductoRepositoryImpl } from "../../infrastructure/repositories/imagen-producto.repository.impl";

export class ImagenesProductosRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new ImagenProductoDatasourceImpl();
        const repository = new ImagenProductoRepositoryImpl(datasource);
        const controller = new ImagenesProductosController(repository);

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
