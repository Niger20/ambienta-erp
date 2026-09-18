import {Router} from "express";
import {ProductsCategoryController} from "./controller";
import {ProductCategoryRepository} from "../../domain";
import {ProductCategoryDatasourceImpl} from "../../infrastructure/datasource/productCategory.datasource.impl";
import {ProductCategoryRepositoryImpl} from "../../infrastructure/repositories/productCategory.repository.impl";


export class CategoriaProductoRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new ProductCategoryDatasourceImpl();
        const repository = new ProductCategoryRepositoryImpl(datasource);

        const productsCategoryController = new ProductsCategoryController( repository );

        router.get('/', productsCategoryController.getProductCategory);
        router.get('/:id', productsCategoryController.getProductCategorybyId);
        router.post('/', productsCategoryController.createProductCategory);
        router.put('/:id', productsCategoryController.updateProductCategory);
        router.delete('/:id', productsCategoryController.deleteProductCategory);

        return router
    }

}