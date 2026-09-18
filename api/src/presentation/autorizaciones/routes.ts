import { Router } from 'express';
import { AutorizacionController } from './controller';
import { AutorizacionDatasourceImpl } from '../../infrastructure/datasource/autorizacion.datasource.impl';
import { AutorizacionRepositoryImpl } from '../../infrastructure/repositories/autorizacion.repository.impl';
import { AutorizacionGateway } from '../../config/ws.adapter';

export class AutorizacionRoutes {
    static routes(gateway: AutorizacionGateway): Router {
        const router = Router();

        const datasource = new AutorizacionDatasourceImpl();
        const repository = new AutorizacionRepositoryImpl(datasource);
        const controller = new AutorizacionController(repository, gateway);

        router.post('/', controller.crear);
        router.get('/pendientes', controller.obtenerPendientes);
        router.get('/:id/estado', controller.obtenerEstado);
        router.put('/:id/aprobar', controller.aprobar);
        router.put('/:id/rechazar', controller.rechazar);
        router.post('/validar', controller.validar);

        return router;
    }
}
