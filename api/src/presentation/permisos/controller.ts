import { Request, Response } from 'express';
import { GetPermisos, PermisoRepository } from "../../domain";

export class PermisosController {

    constructor(private readonly repository: PermisoRepository) {}

    getPermisos = (req: Request, res: Response) => {
        new GetPermisos(this.repository)
            .execute()
            .then((permisos) => res.json(permisos))
            .catch((err) => res.status(400).json({ error: err }));
    };
}
