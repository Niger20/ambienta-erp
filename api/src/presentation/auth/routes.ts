import { Router } from 'express';
import { AuthController } from "./controller";
import { BcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserDatasourceImpl } from "../../infrastructure/datasource/user.datasource.impl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { buildAuthMiddleware } from "../../infrastructure/factories/auth.middleware.factory";
import { buildPermissionMiddleware } from "../../infrastructure/factories/permission.middleware.factory";
import { buildEmailSender } from "../../infrastructure/factories/email.factory";
import { envs } from "../../config/envs";


export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new UserDatasourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const tokenSigner = new JwtAdapter();
        const passwordHasher = new BcryptAdapter();
        const emailSender = buildEmailSender();
        const controller = new AuthController(repository, passwordHasher, tokenSigner, emailSender, envs.APP_BASE_URL);

        const authMiddleware = buildAuthMiddleware();
        const jwtGuard = authMiddleware.validateJWT.bind(authMiddleware);

        const permission = buildPermissionMiddleware();

        // Rutas PÚBLICAS (no requieren token)
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);
        router.get('/verify-email/:token', controller.verifyEmail);

        // Rutas PROTEGIDAS (requieren JWT válido)
        router.post('/admin/register', jwtGuard, permission.requirePermission('usuarios.crear'), controller.adminRegisterUser);
        router.get('/getUser', jwtGuard, permission.requirePermission('usuarios.ver'), controller.getUser);
        router.delete('/deleteUser/:id', jwtGuard, permission.requireSelfOrPermission('usuarios.eliminar'), controller.deleteUser);
        router.put('/updateUser/:id', jwtGuard, permission.requireSelfOrPermission('usuarios.editar'), controller.updateUser);

        router.get('/profile', jwtGuard, controller.getProfile);
        router.put('/profile', jwtGuard, controller.updateProfile);
        router.get('/permissions', jwtGuard, controller.getPermissions);
        router.post('/resend-verification', jwtGuard, controller.resendVerification);
        router.post('/logout', jwtGuard, controller.logoutUser);

        return router;
    }

}
