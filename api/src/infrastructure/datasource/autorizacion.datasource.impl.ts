import prisma from "../../data/postgres";
import { AutorizacionDatasource } from '../../domain/datasources/autorizacion.datasource';
import { AutorizacionEntity } from '../../domain/entitites/autorizacion.entity';
import { CreateAutorizacionDto } from '../../domain/dtos/autorizacion/create-autorizacion.dto';


export class AutorizacionDatasourceImpl implements AutorizacionDatasource {

    async crear(dto: CreateAutorizacionDto): Promise<AutorizacionEntity> {
        const { usuarioid, accion, detalle } = dto;
        const autorizacion = await prisma.autorizaciones.create({
            data: {
                usuarioid,
                accion,
                detalle,
                estado: 'PENDIENTE'
            }
        });
        return AutorizacionEntity.fromObject(autorizacion);
    }

    async obtenerPendientes(): Promise<AutorizacionEntity[]> {
        const pendientes = await prisma.autorizaciones.findMany({
            where: {
                estado: 'PENDIENTE'
            },
            orderBy: {
                fecha: 'desc'
            }
        });

        // Get user names
        const userIds = [...new Set(pendientes.map(p => p.usuarioid))];
        const users = await prisma.usuarios.findMany({
            where: { usuarioid: { in: userIds } },
            select: { usuarioid: true, nombreusuario: true }
        });
        const userMap = new Map(users.map(u => [u.usuarioid, u.nombreusuario]));

        return pendientes.map((p: any) => AutorizacionEntity.fromObject({
            ...p,
            nombreusuario: userMap.get(p.usuarioid) || ''
        }));
    }

    async aprobar(autorizacionid: number): Promise<{ autorizacion: AutorizacionEntity; codigo: string; }> {
        const auth = await prisma.autorizaciones.findFirst({ where: { autorizacionid } });
        if (!auth) throw `Autorización con id ${autorizacionid} no encontrada`;
        if (auth.estado !== 'PENDIENTE') throw `La autorización no está pendiente`;

        // Generate 6-digit random code
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.autorizaciones.updateMany({
            where: { autorizacionid },
            data: { estado: 'APROBADO', codigo }
        });

        const updated = await prisma.autorizaciones.findFirst({ where: { autorizacionid } });

        return {
            autorizacion: AutorizacionEntity.fromObject(updated || auth),
            codigo
        };
    }

    async rechazar(autorizacionid: number): Promise<AutorizacionEntity> {
        const auth = await prisma.autorizaciones.findFirst({ where: { autorizacionid } });
        if (!auth) throw `Autorización con id ${autorizacionid} no encontrada`;

        await prisma.autorizaciones.updateMany({
            where: { autorizacionid },
            data: { estado: 'RECHAZADO' }
        });

        const updated = await prisma.autorizaciones.findFirst({ where: { autorizacionid } });

        return AutorizacionEntity.fromObject(updated || auth);
    }

    async validarCodigo(accion: string, codigo: string): Promise<boolean> {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Search by code only — each approval generates a unique 6-digit code.
        // accion is not required for validation since the code itself is the secret.
        const whereClause: any = {
            codigo,
            estado: 'APROBADO',
            fecha: { gte: yesterday }
        };

        // Only filter by accion if it was actually provided
        if (accion && accion.trim()) {
            whereClause.accion = accion.trim();
        }

        const auth = await prisma.autorizaciones.findFirst({
            where: whereClause
        });

        if (!auth) return false;

        // Mark as used so it can't be reused
        await prisma.autorizaciones.updateMany({
            where: { autorizacionid: auth.autorizacionid },
            data: { estado: 'USADO' }
        });

        return true;
    }

    async obtenerEstado(autorizacionid: number): Promise<string | null> {
        const auth = await prisma.autorizaciones.findFirst({
            where: { autorizacionid },
            select: { estado: true }
        });
        return auth?.estado ?? null;
    }
}
