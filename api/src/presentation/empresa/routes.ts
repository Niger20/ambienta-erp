import {Router} from "express";
import {EmpresaDatasourceImpl} from "../../infrastructure/datasource/empresa.datasource.impl";
import {EmpresaRepositoryImpl} from "../../infrastructure/repositories/empresa.repository.impl";
import {EmpresaController} from "./controller";

export class EmpresasRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new EmpresaDatasourceImpl();
        const repository = new EmpresaRepositoryImpl(datasource);

        const clienteController = new EmpresaController(repository);

        router.get('/', clienteController.getEmpresa);
        router.post('/', clienteController.createEmpresa);
        router.put('/:id', clienteController.updateEmpresa);
        return router
    }

}