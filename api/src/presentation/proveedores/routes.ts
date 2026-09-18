import {Router} from "express";
import {ProductCategoryDatasourceImpl} from "../../infrastructure/datasource/productCategory.datasource.impl";
import {ProductCategoryRepositoryImpl} from "../../infrastructure/repositories/productCategory.repository.impl";
import {ProductsCategoryController} from "../categoria-productos/controller";
import {ProveedorDatasourceImpl} from "../../infrastructure/datasource/proveedor.datasource.impl";
import {ProveedorRepositoryImpl} from "../../infrastructure/repositories/proveedor.repository.impl";
import {ProveedorController} from "./controller";

export class ProveedoresRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new ProveedorDatasourceImpl();
        const repository = new ProveedorRepositoryImpl(datasource);

        const proveedorController = new ProveedorController( repository );

        router.get('/', proveedorController.getProveedor);
        router.get('/:id', proveedorController.getProveedorById);
        router.post('/', proveedorController.createProveedor);
        router.put('/:id', proveedorController.updateProveedor);
        router.delete('/:id', proveedorController.deleteProveedor);

        return router
    }

}