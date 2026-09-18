import { AutorizacionDatasource } from '../../domain/datasources/autorizacion.datasource';
import { AutorizacionEntity } from '../../domain/entitites/autorizacion.entity';
import { AutorizacionRepository } from '../../domain/repositories/autorizacion.repository';
import { CreateAutorizacionDto } from '../../domain/dtos/autorizacion/create-autorizacion.dto';

export class AutorizacionRepositoryImpl implements AutorizacionRepository {

    constructor(private readonly datasource: AutorizacionDatasource) { }

    crear(dto: CreateAutorizacionDto): Promise<AutorizacionEntity> {
        return this.datasource.crear(dto);
    }
    obtenerPendientes(): Promise<AutorizacionEntity[]> {
        return this.datasource.obtenerPendientes();
    }
    aprobar(autorizacionid: number): Promise<{ autorizacion: AutorizacionEntity, codigo: string }> {
        return this.datasource.aprobar(autorizacionid);
    }
    rechazar(autorizacionid: number): Promise<AutorizacionEntity> {
        return this.datasource.rechazar(autorizacionid);
    }
    validarCodigo(accion: string, codigo: string): Promise<boolean> {
        return this.datasource.validarCodigo(accion, codigo);
    }
    obtenerEstado(autorizacionid: number): Promise<string | null> {
        return this.datasource.obtenerEstado(autorizacionid);
    }
}
