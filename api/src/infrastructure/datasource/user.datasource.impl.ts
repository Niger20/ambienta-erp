import { PaginatedResult } from "../../domain/dtos/shared/pagination.dto";
import {
    LoginUserDto,
    RegisterUserDto,
    UpdateUserDto,
    UserDatasource,
    UserEntity,
    UserRole
} from "../../domain";
import prisma from "../../data/postgres";


export class UserDatasourceImpl implements UserDatasource {

    async register(createUserDto: RegisterUserDto): Promise<UserEntity> {
        const rol = createUserDto.rol ?? UserRole.Invitado;

        const user = await prisma.usuarios.create({
            data: {
                nombreusuario: createUserDto.nombreusuario,
                contrasenahash: createUserDto.contrasenahash,
                rol: this.mapRoleToPrisma(rol),
            }
        });

        return UserEntity.fromObject(user);
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
        if (data.rol != null) data.rol = this.mapRoleToPrisma(data.rol as UserRole);

        const updatedUser = await prisma.usuarios.update({
            where: { usuarioid: updateUserDto.id },
            data
        });

        return UserEntity.fromObject(updatedUser);
    }

    async getById(id: number): Promise<UserEntity> {
        const usuario = await prisma.usuarios.findFirst({
            where: { usuarioid: id }
        });

        if (!usuario) throw 'Usuario not found';

        return UserEntity.fromObject(usuario);
    }

    private mapRoleToPrisma(role: UserRole): string {
        switch (role) {
            case UserRole.Administrador:
                return 'ADMINISTRADOR';
            case UserRole.Empleado:
                return 'EMPLEADO';
            case UserRole.Invitado:
                return 'INVITADO';
            default:
                return 'INVITADO';
        }
    }
}