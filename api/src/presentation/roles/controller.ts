import { Request, Response } from 'express';
import {
    AsignarPermisosDto,
    CreateRol,
    CreateRolDto,
    DeleteRol,
    GetByIdRol,
    GetRoles,
    AsignarPermisos,
    RolRepository,
    UpdateRol,
    UpdateRolDto,
} from "../../domain";

export class RolesController {

    constructor(private readonly repository: RolRepository) {}

    private handleError = (error: unknown, res: Response) => {
        if (typeof error === 'string') return res.status(400).json({ error });
        console.error('[RolesController Error]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };

    getRoles = (req: Request, res: Response) => {
        new GetRoles(this.repository)
            .execute()
            .then((roles) => res.json(roles))
            .catch((err) => this.handleError(err, res));
    };

    getRolById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdRol(this.repository)
            .execute(id)
            .then((rol) => res.json(rol))
            .catch((err) => this.handleError(err, res));
    };

    createRol = (req: Request, res: Response) => {
        const [error, dto] = CreateRolDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateRol(this.repository)
            .execute(dto!)
            .then((rol) => res.json(rol))
            .catch((err) => this.handleError(err, res));
    };

    updateRol = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateRolDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateRol(this.repository)
            .execute(dto!)
            .then((rol) => res.json(rol))
            .catch((err) => this.handleError(err, res));
    };

    deleteRol = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteRol(this.repository)
            .execute(id)
            .then((rol) => res.json(rol))
            .catch((err) => this.handleError(err, res));
    };

    asignarPermisos = (req: Request, res: Response) => {
        const rolid = +req.params.id;
        const [error, dto] = AsignarPermisosDto.create({ ...req.body, rolid });
        if (error) return res.status(400).json({ error });

        new AsignarPermisos(this.repository)
            .execute(dto!)
            .then((rol) => res.json(rol))
            .catch((err) => this.handleError(err, res));
    };
}
