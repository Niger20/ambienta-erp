import { Request, Response } from 'express';
import {
    AdminRegisterUser,
    AdminRegisterUserDto,
    DeleteUser,
    EmailSender,
    GetProfile,
    GetUser,
    LoginUser,
    LoginUserDto,
    LogoutUser,
    PasswordHasher,
    RegisterUser,
    RegisterUserDto,
    ResendVerification,
    TokenSigner,
    UpdateProfile,
    UpdateProfileDto,
    UpdateUser,
    UpdateUserDto,
    UserEntity,
    UserRepository,
    VerifyEmail,
} from "../../domain";


export class AuthController {

    constructor(
        public readonly repository: UserRepository,
        public readonly passwordHasher: PasswordHasher,
        public readonly tokenSigner: TokenSigner,
        public readonly emailSender: EmailSender,
        public readonly appBaseUrl: string,
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (typeof error === 'string') return res.status(400).json({ error });
        console.error('[AuthController Error]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    /** Registro PÚBLICO — rol "invitado" forzado, dispara verificación de correo. */
    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new RegisterUser(this.repository, this.passwordHasher, this.emailSender, this.appBaseUrl)
            .execute(registerDto!)
            .then(user => res.json({ user, mensaje: 'Cuenta creada. Revisa tu correo para verificarla.' }))
            .catch(err => this.handleError(err, res));
    }

    /** Alta de usuario POR UN ADMINISTRADOR — permite fijar el rol. */
    adminRegisterUser = (req: Request, res: Response) => {
        const [error, dto] = AdminRegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new AdminRegisterUser(this.repository, this.passwordHasher)
            .execute(dto!)
            .then(user => res.json(user))
            .catch(err => this.handleError(err, res));
    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new LoginUser(this.repository, this.passwordHasher, this.tokenSigner)
            .execute(loginDto!)
            .then(result => {
                if (!result) return res.status(401).json({ error: 'Credenciales inválidas' });
                return res.json({
                    token: result.token,
                    permissions: result.permissions,
                    user: {
                        id: result.user.id,
                        nombreusuario: result.user.nombreusuario,
                        rol: result.user.rol,
                        nombre: result.user.nombre,
                        correo: result.user.correo,
                        correoVerificado: result.user.correoverificado,
                    }
                });
            })
            .catch(err => this.handleError(err, res));
    }

    logoutUser = (req: Request, res: Response) => {
        const jti = (req as { jti?: string }).jti;
        if (!jti) return res.json({ ok: true });

        new LogoutUser(this.repository)
            .execute(jti)
            .then(() => res.json({ ok: true }))
            .catch(err => this.handleError(err, res));
    }

    getUser = (req: Request, res: Response) => {
        new GetUser(this.repository)
            .execute()
            .then(user => res.json(user))
            .catch(err => this.handleError(err, res));
    }

    deleteUser = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteUser(this.repository)
            .execute(id)
            .then(user => res.json(user))
            .catch(err => this.handleError(err, res));
    }

    updateUser = (req: Request, res: Response) => {
        const [error, updateDto] = UpdateUserDto.create({
            ...req.body,
            id: req.params.id
        });
        if (error) return res.status(400).json({ error });

        new UpdateUser(this.repository, this.passwordHasher)
            .execute(updateDto!)
            .then(user => res.json(user))
            .catch(err => this.handleError(err, res));
    }

    getProfile = (req: Request, res: Response) => {
        const user = (req as { user?: UserEntity }).user;
        if (!user) return res.status(401).json({ error: 'No autenticado' });

        new GetProfile(this.repository)
            .execute(user.id)
            .then(profile => res.json(profile))
            .catch(err => this.handleError(err, res));
    }

    updateProfile = (req: Request, res: Response) => {
        const user = (req as { user?: UserEntity }).user;
        if (!user) return res.status(401).json({ error: 'No autenticado' });

        const [error, dto] = UpdateProfileDto.create({ ...req.body, usuarioid: user.id });
        if (error) return res.status(400).json({ error });

        new UpdateProfile(this.repository, this.passwordHasher)
            .execute(dto!)
            .then(profile => res.json(profile))
            .catch(err => this.handleError(err, res));
    }

    verifyEmail = (req: Request, res: Response) => {
        const token = String(req.params.token);

        new VerifyEmail(this.repository)
            .execute(token)
            .then(() => res.json({ ok: true, mensaje: 'Correo verificado correctamente.' }))
            .catch(err => this.handleError(err, res));
    }

    resendVerification = (req: Request, res: Response) => {
        const user = (req as { user?: UserEntity }).user;
        if (!user) return res.status(401).json({ error: 'No autenticado' });

        new ResendVerification(this.repository, this.emailSender, this.appBaseUrl)
            .execute(user.id)
            .then(() => res.json({ ok: true, mensaje: 'Correo de verificación reenviado.' }))
            .catch(err => this.handleError(err, res));
    }

    getPermissions = (req: Request, res: Response) => {
        const user = (req as { user?: UserEntity }).user;
        if (!user) return res.status(401).json({ error: 'No autenticado' });

        this.repository.getPermisosDeRol(user.rolid ?? null)
            .then(permissions => res.json({ permissions }))
            .catch(err => this.handleError(err, res));
    }

}
