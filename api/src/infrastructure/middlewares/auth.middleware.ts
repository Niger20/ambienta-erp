import { NextFunction, Request, Response } from "express";
import { TokenSigner, UserRepository } from "../../domain";
import { GetByIdUser } from "../../domain/use-cases/auth/getById-user";



export class AuthMiddleware {

    constructor(
        private readonly tokenSigner: TokenSigner,
        private readonly getByIdUser: GetByIdUser,
        private readonly userRepository: UserRepository,
    ) { }

    validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'OPTIONS') return next();

        const authorization = (req.header('Authorization') || req.headers['authorization']) as string;
        if (!authorization) return res.status(401).send({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).send({ error: 'Invalid token format Bearer' });

        const token = authorization.split(' ')[1];
        if (!token) return res.status(401).send({ error: 'Invalid token' });

        try {
            const payload = this.tokenSigner.validate<{ id: number; jti?: string }>(token);
            if (!payload) return res.status(401).send({ error: 'Invalid token' });

            if (payload.jti) {
                const isValid = await this.userRepository.isTokenSesionValid(payload.jti);
                if (!isValid) return res.status(401).send({ error: 'Sesión inválida o cerrada' });
            }

            const user = await this.getByIdUser.execute(payload.id);
            if (!user) return res.status(401).send({ error: 'User not found' });

            (req as { user?: unknown }).user = user;
            (req as { jti?: string }).jti = payload.jti;
            return next();
        } catch (error) {
            console.error('[AuthMiddleware] Token validation error:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }

    }

}
