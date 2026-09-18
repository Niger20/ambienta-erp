import 'dotenv/config';
import { hashSync, genSaltSync } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = `${process.env.POSTGRES_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';

interface PermisoSeed {
    codigo: string;
    modulo: string;
    descripcion: string;
}

const PERMISOS: PermisoSeed[] = [
    { codigo: 'dashboard.ver', modulo: 'dashboard', descripcion: 'Ver el tablero de control' },
    { codigo: 'pos.ver', modulo: 'pos', descripcion: 'Usar el punto de venta' },
    { codigo: 'settings.ver', modulo: 'settings', descripcion: 'Ver ajustes y perfil propio' },

    { codigo: 'productos.ver', modulo: 'productos', descripcion: 'Ver productos e inventario' },
    { codigo: 'ventas.ver', modulo: 'ventas', descripcion: 'Ver historial de ventas' },
    { codigo: 'compras.ver', modulo: 'compras', descripcion: 'Ver compras a proveedores' },
    { codigo: 'deliveries.ver', modulo: 'deliveries', descripcion: 'Ver repartidores y entregas' },

    { codigo: 'gastos.ver', modulo: 'gastos', descripcion: 'Ver gastos operativos' },
    { codigo: 'sesiones.ver', modulo: 'sesiones', descripcion: 'Ver sesiones y cierres de caja' },
    { codigo: 'reportes.ver', modulo: 'reportes', descripcion: 'Ver reportes administrativos' },

    { codigo: 'usuarios.ver', modulo: 'usuarios', descripcion: 'Ver el listado de usuarios' },
    { codigo: 'usuarios.crear', modulo: 'usuarios', descripcion: 'Crear usuarios (alta administrativa)' },
    { codigo: 'usuarios.editar', modulo: 'usuarios', descripcion: 'Editar cualquier usuario' },
    { codigo: 'usuarios.eliminar', modulo: 'usuarios', descripcion: 'Eliminar cualquier usuario' },

    { codigo: 'roles.ver', modulo: 'roles', descripcion: 'Ver roles y permisos' },
    { codigo: 'roles.crear', modulo: 'roles', descripcion: 'Crear roles nuevos' },
    { codigo: 'roles.editar', modulo: 'roles', descripcion: 'Editar roles existentes' },
    { codigo: 'roles.eliminar', modulo: 'roles', descripcion: 'Eliminar roles (no de sistema)' },
    { codigo: 'roles.asignar_permisos', modulo: 'roles', descripcion: 'Asignar permisos a un rol' },
];

const ROLE_PERMISOS: Record<string, string[]> = {
    administrador: PERMISOS.map((p) => p.codigo),
    empleado: [
        'dashboard.ver', 'pos.ver', 'settings.ver',
        'productos.ver', 'ventas.ver', 'compras.ver', 'deliveries.ver',
    ],
    invitado: [
        'dashboard.ver', 'pos.ver', 'settings.ver',
    ],
};

async function main() {
    console.log('Sembrando permisos...');
    for (const permiso of PERMISOS) {
        await prisma.permisos.upsert({
            where: { codigo: permiso.codigo },
            update: { modulo: permiso.modulo, descripcion: permiso.descripcion },
            create: permiso,
        });
    }

    console.log('Sembrando roles...');
    for (const nombre of Object.keys(ROLE_PERMISOS)) {
        const rol = await prisma.roles.upsert({
            where: { nombre },
            update: {},
            create: { nombre, essistema: true, descripcion: `Rol de sistema: ${nombre}` },
        });

        const permisosDelRol = await prisma.permisos.findMany({
            where: { codigo: { in: ROLE_PERMISOS[nombre] } },
        });

        console.log(`  Asignando ${permisosDelRol.length} permisos a "${nombre}"...`);
        for (const permiso of permisosDelRol) {
            await prisma.rolespermisos.upsert({
                where: { rolid_permisoid: { rolid: rol.rolid, permisoid: permiso.permisoid } },
                update: {},
                create: { rolid: rol.rolid, permisoid: permiso.permisoid },
            });
        }
    }

    console.log('Vinculando usuarios existentes por su columna "rol" legado...');
    const roles = await prisma.roles.findMany();
    for (const rol of roles) {
        await prisma.usuarios.updateMany({
            where: { rol: rol.nombre, rolid: null },
            data: { rolid: rol.rolid },
        });
    }

    console.log('Verificando administrador por defecto (bootstrap)...');
    const hayAdministradores = await prisma.usuarios.count({ where: { rol: 'administrador' } });
    if (hayAdministradores === 0) {
        const rolAdmin = await prisma.roles.findUniqueOrThrow({ where: { nombre: 'administrador' } });
        const contrasenahash = hashSync(DEFAULT_ADMIN_PASSWORD, genSaltSync());

        await prisma.usuarios.create({
            data: {
                nombreusuario: DEFAULT_ADMIN_USER,
                contrasenahash,
                nombre: 'Administrador',
                rol: 'administrador',
                rolid: rolAdmin.rolid,
                correoverificado: true,
            },
        });

        console.log(`  Usuario administrador creado -> usuario: "${DEFAULT_ADMIN_USER}" / contraseña: "${DEFAULT_ADMIN_PASSWORD}" (cámbiala después de iniciar sesión).`);
    } else {
        console.log('  Ya existe al menos un administrador, no se crea uno nuevo.');
    }

    console.log('Seed completo.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
