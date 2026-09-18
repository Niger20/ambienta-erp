import { PaginatedResult } from "../dtos/shared/pagination.dto";
import { AutorizacionEntity } from '../entitites/autorizacion.entity';
import { CreateAutorizacionDto } from '../dtos/autorizacion/create-autorizacion.dto';

export abstract class AutorizacionDatasource {

    abstract crear(dto: CreateAutorizacionDto): Promise<AutorizacionEntity>;
    abstract obtenerPendientes(): Promise<AutorizacionEntity[]>;
    abstract aprobar(autorizacionid: number): Promise<{ autorizacion: AutorizacionEntity, codigo: string }>;
    abstract rechazar(autorizacionid: number): Promise<AutorizacionEntity>;
    abstract validarCodigo(accion: string, codigo: string): Promise<boolean>;
    abstract obtenerEstado(autorizacionid: number): Promise<string | null>;

}
