import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    AdminRegisterUserDto,
    LoginUserDto,
    RegisterUserDto,
    UpdateUserDto,
    UserDatasource,
    UserEntity,
    UserRole,
    VerificationTokenRecord,
} from "../../domain";
import prisma from "../../data/postgres";

const UNIQUE_FIELD_LABELS: Record<string, string> = {
    nombreusuario: 'Ese nombre de usuario ya está en uso',
    correo: 'Ese correo ya está registrado',
};

/** Traduce un choque de restricción única de Prisma (P2002) a un mensaje legible. */
function friendlyUniqueConstraintError(error: unknown): string | null {
    const prismaError = error as { code?: string; meta?: { target?: string[] | string } };
    if (prismaError?.code !== 'P2002') return null;

    const target = prismaError.meta?.target;
    const fields = Array.isArray(target) ? target : typeof target === 'string' ? [target] : [];
    const field = fields.find((f) => UNIQUE_FIELD_LABELS[f]);

    return field ? UNIQUE_FIELD_LABELS[field] : 'Ya existe un registro con esos datos';
}

export class UserDatasourceImpl implements UserDatasource {

    async register(createUserDto: RegisterUserDto): Promise<UserEntity> {
        const rolInvitado = await prisma.roles.findUnique({ where: { nombre: UserRole.Invitado } });

        try {
            const user = await prisma.usuarios.create({
                data: {
                    nombreusuario: createUserDto.nombreusuario,
                    contrasenahash: createUserDto.contrasenahash,
                    nombre: createUserDto.nombre,
                    correo: createUserDto.correo,
                    correoverificado: false,
                    rol: UserRole.Invitado,
                    rolid: rolInvitado?.rolid ?? null,
                }
            });

            return UserEntity.fromObject(user);
        } catch (error) {
            throw friendlyUniqueConstraintError(error) ?? error;
        }
    }

    async adminRegister(createUserDto: AdminRegisterUserDto): Promise<UserEntity> {
        let rolRow: { rolid: number; nombre: string } | null = null;

        if (createUserDto.rolid != null) {
            rolRow = await prisma.roles.findUnique({ where: { rolid: createUserDto.rolid } });
            if (!rolRow) throw 'Rol no encontrado';
        } else {
            const rol = createUserDto.rol ?? UserRole.Invitado;
            rolRow = await prisma.roles.findUnique({ where: { nombre: rol } });
        }

        try {
            const user = await prisma.usuarios.create({
                data: {
                    nombreusuario: createUserDto.nombreusuario,
                    contrasenahash: createUserDto.contrasenahash,
                    nombre: createUserDto.nombre,
                    correo: createUserDto.correo,
                    rol: rolRow?.nombre ?? UserRole.Invitado,
                    rolid: rolRow?.rolid ?? null,
                }
            });

            return UserEntity.fromObject(user);
        } catch (error) {
            throw friendlyUniqueConstraintError(error) ?? error;
        }
    }

    async delete(id: number): Promise<UserEntity> {
        await this.getById(id);

        const deletedUser = await prisma.usuarios.delete({
            where: { usuarioid: id }
        });

        return UserEntity.fromObject(deletedUser);
    }

    async getAll(page?: number, limit?: number): Promise<PaginatedResult<UserEntity>> {
        const isPaginated = limit !== undefined && limit > 0;
        const currentPage = page || 1;
        const pageSize = limit || 25;

        const findOptions: any = {};
        if (isPaginated) {
            findOptions.skip = (currentPage - 1) * pageSize;
            findOptions.take = pageSize;
        }

        const [total, usuarios] = await Promise.all([
            prisma.usuarios.count(),
            prisma.usuarios.findMany(findOptions),
        ]);

        return {
            data: usuarios.map((item) => UserEntity.fromObject(item)),
            pagination: {
                page: isPaginated ? currentPage : 1,
                limit: isPaginated ? pageSize : total,
                total,
                totalPages: isPaginated ? Math.ceil(total / pageSize) : 1,
            },
        };
    }

    async login(dto: LoginUserDto): Promise<UserEntity | null> {
        const usuario = await prisma.usuarios.findFirst({
            where: { nombreusuario: dto.nombreusuario }
        });

        return usuario ? UserEntity.fromObject(usuario) : null;
    }

    async update(updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        await this.getById(updateUserDto.id);

        const data = { ...updateUserDto.values } as { [key: string]: any };

        if (data.rolid != null) {
            const rolRow = await prisma.roles.findUnique({ where: { rolid: data.rolid } });
            if (!rolRow) throw 'Rol no encontrado';
            data.rol = rolRow.nombre;
        } else if (data.rol != null) {
            const rolRow = await prisma.roles.findUnique({ where: { nombre: data.rol as UserRole } });
            data.rol = this.mapRoleToPrisma(data.rol as UserRole);
            data.rolid = rolRow?.rolid ?? null;
        }

        try {
            const updatedUser = await prisma.usuarios.update({
                where: { usuarioid: updateUserDto.id },
                data
            });

            return UserEntity.fromObject(updatedUser);
        } catch (error) {
            throw friendlyUniqueConstraintError(error) ?? error;
        }
    }

    async updateProfile(usuarioid: number, values: { [key: string]: any }): Promise<UserEntity> {
        await this.getById(usuarioid);

        try {
            const updatedUser = await prisma.usuarios.update({
                where: { usuarioid },
                data: values,
            });

            return UserEntity.fromObject(updatedUser);
        } catch (error) {
            throw friendlyUniqueConstraintError(error) ?? error;
        }
    }

    async getById(id: number): Promise<UserEntity> {
        const usuario = await prisma.usuarios.findFirst({
            where: { usuarioid: id }
        });

        if (!usuario) throw 'Usuario not found';

        return UserEntity.fromObject(usuario);
    }

    async getByCorreo(correo: string): Promise<UserEntity | null> {
        const usuario = await prisma.usuarios.findFirst({ where: { correo } });
        return usuario ? UserEntity.fromObject(usuario) : null;
    }

    async getPermisosDeRol(rolid: number | null): Promise<string[]> {
        if (!rolid) return [];

        const rolesPermisos = await prisma.rolespermisos.findMany({
            where: { rolid },
            include: { permisos: true },
        });

        return rolesPermisos.map((rp) => rp.permisos.codigo);
    }

    async createVerificationToken(usuarioid: number, token: string, tipo: string, expiracion: Date): Promise<void> {
        await prisma.verificacionestoken.create({
            data: { usuarioid, token, tipo, expiracion },
        });
    }

    async findVerificationToken(token: string): Promise<VerificationTokenRecord | null> {
        const record = await prisma.verificacionestoken.findUnique({ where: { token } });
        if (!record) return null;

        return {
            usuarioid: record.usuarioid,
            tipo: record.tipo,
            expiracion: record.expiracion,
            usado: record.usado,
        };
    }

    async markVerificationTokenUsed(token: string): Promise<void> {
        await prisma.verificacionestoken.update({
            where: { token },
            data: { usado: true },
        });
    }

    async markEmailVerified(usuarioid: number): Promise<void> {
        await prisma.usuarios.update({
            where: { usuarioid },
            data: { correoverificado: true },
        });
    }

    async invalidatePendingVerificationTokens(usuarioid: number, tipo: string): Promise<void> {
        await prisma.verificacionestoken.updateMany({
            where: { usuarioid, tipo, usado: false },
            data: { usado: true },
        });
    }

    async createTokenSesion(usuarioid: number, jti: string, fechaexpira: Date): Promise<void> {
        await prisma.tokensesion.create({
            data: { usuarioid, jti, fechaexpira },
        });
    }

    async isTokenSesionValid(jti: string): Promise<boolean> {
        const record = await prisma.tokensesion.findUnique({ where: { jti } });
        return !!record && !record.revocado;
    }

    async revokeTokenSesion(jti: string): Promise<void> {
        await prisma.tokensesion.updateMany({
            where: { jti },
            data: { revocado: true, fecharevocado: new Date() },
        });
    }

    /** Mantiene sincronizada la columna legada `usuarios.rol` con `roles.nombre` (ambas en minúscula). */
    private mapRoleToPrisma(role: UserRole): string {
        switch (role) {
            case UserRole.Administrador:
                return UserRole.Administrador;
            case UserRole.Empleado:
                return UserRole.Empleado;
            case UserRole.Invitado:
            default:
                return UserRole.Invitado;
        }
    }
}
