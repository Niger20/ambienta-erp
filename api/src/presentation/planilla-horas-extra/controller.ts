import { Request, Response } from 'express';
import {
    CreatePlanillaHoraExtra,
    CreatePlanillaHoraExtraDto,
    DeletePlanillaHoraExtra,
    GetByIdPlanillaHoraExtra,
    GetPlanillaHoraExtra,
    PaginationDto,
    PlanillaHoraExtraRepository,
    UpdatePlanillaHoraExtra,
    UpdatePlanillaHoraExtraDto
} from "../../domain";

export class PlanillaHorasExtraController {
    constructor(private readonly repository: PlanillaHoraExtraRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const detalleid = req.query.detalleid ? +req.query.detalleid : (req.query.planilladetalleid ? +req.query.planilladetalleid : undefined);

        new GetPlanillaHoraExtra(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, detalleid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPlanillaHoraExtra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePlanillaHoraExtraDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePlanillaHoraExtra(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePlanillaHoraExtraDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePlanillaHoraExtra(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePlanillaHoraExtra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
