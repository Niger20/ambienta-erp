import { Router } from "express";
import { RolesController } from "./controller";
import { RolRepositoryImpl } from "../../infrastructure/repositories/rol.repository.impl";
import { RolDatasourceImpl } from "../../infrastructure/datasource/rol.datasource.impl";
import { buildPermissionMiddleware } from "../../infrastructure/factories/permission.middleware.factory";

export class RolesRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new RolDatasourceImpl();
        const repository = new RolRepositoryImpl(datasource);
        const controller = new RolesController(repository);

        const permission = buildPermissionMiddleware();

        router.get('/', permission.requirePermission('roles.ver'), controller.getRoles);
        router.get('/:id', permission.requirePermission('roles.ver'), controller.getRolById);
        router.post('/', permission.requirePermission('roles.crear'), controller.createRol);
        router.put('/:id', permission.requirePermission('roles.editar'), controller.updateRol);
        router.delete('/:id', permission.requirePermission('roles.eliminar'), controller.deleteRol);
        router.put('/:id/permisos', permission.requirePermission('roles.asignar_permisos'), controller.asignarPermisos);

        return router;
    }

}
