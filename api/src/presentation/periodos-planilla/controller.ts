import { Request, Response } from 'express';
import {
    CreatePeriodoPlanilla,
    CreatePeriodoPlanillaDto,
    DeletePeriodoPlanilla,
    GetByIdPeriodoPlanilla,
    GetPeriodoPlanilla,
    PaginationDto,
    PeriodoPlanillaRepository,
    UpdatePeriodoPlanilla,
    UpdatePeriodoPlanillaDto
} from "../../domain";

export class PeriodosPlanillaController {
    constructor(private readonly repository: PeriodoPlanillaRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetPeriodoPlanilla(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPeriodoPlanilla(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePeriodoPlanillaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePeriodoPlanilla(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePeriodoPlanillaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePeriodoPlanilla(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePeriodoPlanilla(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
