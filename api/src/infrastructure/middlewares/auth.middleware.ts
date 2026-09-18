import { NextFunction, Request, Response } from "express";
import { TokenSigner } from "../../domain";
import { GetByIdUser } from "../../domain/use-cases/auth/getById-user";



export class AuthMiddleware {

    constructor(
        private readonly tokenSigner: TokenSigner,
        private readonly getByIdUser: GetByIdUser,
    ) { }

    async validateJWT(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') return next();

        const authorization = (req.header('Authorization') || req.headers['authorization']) as string;
        if (!authorization) return res.status(401).send({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).send({ error: 'Invalid token format Bearer' });

        const token = authorization.split(' ')[1];
        if (!token) return res.status(401).send({ error: 'Invalid token' });

        try {
            const payload = this.tokenSigner.validate<{ id: number }>(token);
            if (!payload) return res.status(401).send({ error: 'Invalid token' });

            const user = await this.getByIdUser.execute(payload.id);
            if (!user) return res.status(401).send({ error: 'User not found' });

            (req as { user?: unknown }).user = user;
            return next();
        } catch (error) {
            console.error('[AuthMiddleware] Token validation error:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }

    }

}