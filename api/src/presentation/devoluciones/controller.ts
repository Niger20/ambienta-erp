import { Request, Response } from 'express';
import {
    CreateDevolucion,
    CreateDevolucionDto,
    DeleteDevolucion,
    DevolucionRepository,
    GetByIdDevolucion,
    GetDevolucion,
    PaginationDto,
    UpdateDevolucion,
    UpdateDevolucionDto
} from "../../domain";

export class DevolucionesController {
    constructor(private readonly repository: DevolucionRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const ventaid = req.query.ventaid ? +req.query.ventaid : undefined;
        const productoid = req.query.productoid ? +req.query.productoid : undefined;

        new GetDevolucion(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, ventaid, productoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdDevolucion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const usuarioid = (req.body.user && req.body.user.id) ? req.body.user.id : req.body.usuarioid;
        const [error, dto] = CreateDevolucionDto.create({ ...req.body, usuarioid });
        if (error) return res.status(400).json({ error });

        new CreateDevolucion(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateDevolucionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateDevolucion(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteDevolucion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
