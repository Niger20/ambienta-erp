import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import { DeleteUser, GetUser, LoginUser, LoginUserDto, PasswordHasher, RegisterUser, RegisterUserDto, TokenSigner, UpdateUser, UpdateUserDto, UserRepository } from "../../domain";


export class AuthController {

    constructor(
        public readonly repository: UserRepository,
        public readonly passwordHasher: PasswordHasher,
        public readonly tokenSigner: TokenSigner,
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (typeof error === 'string') return res.status(400).json({ error });
        console.error('[AuthController Error]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new RegisterUser(this.repository, this.passwordHasher)
            .execute(registerDto!)
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
                    user: {
                        id: result.user.id,
                        nombreusuario: result.user.nombreusuario,
                        rol: result.user.rol
                    }
                });
            })
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

}