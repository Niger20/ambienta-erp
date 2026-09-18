import { Router } from 'express';
import { AuthController } from "./controller";
import { BcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserDatasourceImpl } from "../../infrastructure/datasource/user.datasource.impl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { buildAuthMiddleware } from "../../infrastructure/factories/auth.middleware.factory";


export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new UserDatasourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const tokenSigner = new JwtAdapter();
        const passwordHasher = new BcryptAdapter();
        const controller = new AuthController(repository, passwordHasher, tokenSigner);

        const authMiddleware = buildAuthMiddleware();
        const jwtGuard = authMiddleware.validateJWT.bind(authMiddleware);

        // Rutas PÚBLICAS (no requieren token)
        router.post('/login', controller.loginUser);

        // Rutas PROTEGIDAS (requieren JWT válido)
        router.post('/register', jwtGuard, controller.registerUser);
        router.get('/getUser', jwtGuard, controller.getUser);
        router.delete('/deleteUser/:id', jwtGuard, controller.deleteUser);
        router.put('/updateUser/:id', jwtGuard, controller.updateUser);

        return router;
    }

}
