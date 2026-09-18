import { PermisoDatasource, PermisoEntity } from "../../domain";
import prisma from "../../data/postgres";

export class PermisoDatasourceImpl implements PermisoDatasource {

    async getAll(): Promise<PermisoEntity[]> {
        const permisos = await prisma.permisos.findMany({ orderBy: [{ modulo: 'asc' }, { codigo: 'asc' }] });
        return permisos.map((p) => PermisoEntity.fromObject(p));
    }
}
