import {Router} from "express";
import {ClienteDatasourceImpl} from "../../infrastructure/datasource/cliente.datasource.impl";
import {ClienteRepositoryImpl} from "../../infrastructure/repositories/cliente.repository.impl";
import {ClienteController} from "./controller";

export class ClientesRoutes {

    static get routes() : Router {

        const router = Router();

        const datasource = new ClienteDatasourceImpl();
        const repository = new ClienteRepositoryImpl(datasource);

        const clienteController = new ClienteController(repository);

        router.get('/', clienteController.getCliente);
        router.get('/:id', clienteController.getClienteById);
        router.post('/', clienteController.createCliente);
        router.put('/:id', clienteController.updateCliente);
        router.delete('/:id', clienteController.deleteCliente);

        return router
    }

}