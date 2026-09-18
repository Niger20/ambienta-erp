import { Request, Response } from 'express';
import {
    AuditoriaRepository,
    CreateAuditoria,
    CreateAuditoriaDto,
    GetAuditoria,
    GetByIdAuditoria,
    PaginationDto
} from "../../domain";

export class AuditoriaController {
    constructor(private readonly repository: AuditoriaRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const tabla = req.query.tabla ? String(req.query.tabla) : undefined;
        const usuarioid = req.query.usuarioid ? +req.query.usuarioid : undefined;

        new GetAuditoria(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, tabla, usuarioid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdAuditoria(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAuditoriaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAuditoria(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
