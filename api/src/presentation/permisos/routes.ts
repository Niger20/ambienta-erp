import { Router } from "express";
import { PermisosController } from "./controller";
import { PermisoRepositoryImpl } from "../../infrastructure/repositories/permiso.repository.impl";
import { PermisoDatasourceImpl } from "../../infrastructure/datasource/permiso.datasource.impl";
import { buildPermissionMiddleware } from "../../infrastructure/factories/permission.middleware.factory";

export class PermisosRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new PermisoDatasourceImpl();
        const repository = new PermisoRepositoryImpl(datasource);
        const controller = new PermisosController(repository);

        const permission = buildPermissionMiddleware();

        router.get('/', permission.requirePermission('roles.ver'), controller.getPermisos);

        return router;
    }

}
