import { Request, Response } from 'express';
import {
    CreateMerma,
    CreateMermaDto,
    DeleteMerma,
    GetByIdMerma,
    GetMerma,
    MermaRepository,
    PaginationDto,
    UpdateMerma,
    UpdateMermaDto
} from "../../domain";

export class MermasController {
    constructor(private readonly repository: MermaRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const productoid = req.query.productoid ? +req.query.productoid : undefined;
        const usuarioid = req.query.usuarioid ? +req.query.usuarioid : undefined;

        new GetMerma(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, productoid, usuarioid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdMerma(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const usuarioid = (req.body.user && req.body.user.id) ? req.body.user.id : req.body.usuarioid;
        const [error, dto] = CreateMermaDto.create({ ...req.body, usuarioid });
        if (error) return res.status(400).json({ error });

        new CreateMerma(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateMermaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateMerma(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteMerma(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
