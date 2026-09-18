import { CreateRolDto, RolDatasource, RolEntity, UpdateRolDto } from "../../domain";
import prisma from "../../data/postgres";

const ROL_INCLUDE = { rolespermisos: { include: { permisos: true } } };

export class RolDatasourceImpl implements RolDatasource {

    async create(dto: CreateRolDto): Promise<RolEntity> {
        const rol = await prisma.roles.create({
            data: { nombre: dto.nombre, descripcion: dto.descripcion, essistema: false },
            include: ROL_INCLUDE,
        });

        return RolEntity.fromObject(rol);
    }

    async getAll(): Promise<RolEntity[]> {
        const roles = await prisma.roles.findMany({ include: ROL_INCLUDE, orderBy: { rolid: 'asc' } });
        return roles.map((r) => RolEntity.fromObject(r));
    }

    async getById(id: number): Promise<RolEntity | null> {
        const rol = await prisma.roles.findUnique({ where: { rolid: id }, include: ROL_INCLUDE });
        return rol ? RolEntity.fromObject(rol) : null;
    }

    async update(dto: UpdateRolDto): Promise<RolEntity | null> {
        const rol = await prisma.roles.update({
            where: { rolid: dto.id },
            data: dto.values,
            include: ROL_INCLUDE,
        });

        return RolEntity.fromObject(rol);
    }

    async delete(id: number): Promise<RolEntity> {
        const rol = await prisma.roles.findUnique({ where: { rolid: id }, include: ROL_INCLUDE });
        if (!rol) throw 'Rol no encontrado';

        try {
            await prisma.roles.delete({ where: { rolid: id } });
        } catch {
            throw 'No se puede eliminar: hay usuarios asignados a este rol';
        }

        return RolEntity.fromObject(rol);
    }

    async asignarPermisos(rolid: number, permisoIds: number[]): Promise<RolEntity> {
        await prisma.$transaction([
            prisma.rolespermisos.deleteMany({ where: { rolid } }),
            prisma.rolespermisos.createMany({
                data: permisoIds.map((permisoid) => ({ rolid, permisoid })),
                skipDuplicates: true,
            }),
        ]);

        const rol = await prisma.roles.findUnique({ where: { rolid }, include: ROL_INCLUDE });
        if (!rol) throw 'Rol no encontrado';

        return RolEntity.fromObject(rol);
    }
}
