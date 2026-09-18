import { NextFunction, Request, Response } from "express";
import { UserEntity, UserRepository } from "../../domain";

export class PermissionMiddleware {

    constructor(private readonly userRepository: UserRepository) {}

    requirePermission = (codigo: string) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = (req as { user?: UserEntity }).user;
            if (!user) return res.status(401).json({ error: 'No autenticado' });

            const permisos = await this.userRepository.getPermisosDeRol(user.rolid ?? null);
            if (!permisos.includes(codigo)) {
                return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
            }

            return next();
        };
    };

    requireSelfOrPermission = (codigo: string, paramKey: string = 'id') => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = (req as { user?: UserEntity }).user;
            if (!user) return res.status(401).json({ error: 'No autenticado' });

            const targetId = Number(req.params[paramKey]);
            if (!Number.isNaN(targetId) && targetId === user.id) return next();

            const permisos = await this.userRepository.getPermisosDeRol(user.rolid ?? null);
            if (!permisos.includes(codigo)) {
                return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
            }

            return next();
        };
    };
}
