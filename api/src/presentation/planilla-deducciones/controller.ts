import { Request, Response } from 'express';
import {
    CreatePlanillaDeduccion,
    CreatePlanillaDeduccionDto,
    DeletePlanillaDeduccion,
    GetByIdPlanillaDeduccion,
    GetPlanillaDeduccion,
    PaginationDto,
    PlanillaDeduccionRepository,
    UpdatePlanillaDeduccion,
    UpdatePlanillaDeduccionDto
} from "../../domain";

export class PlanillaDeduccionesController {
    constructor(private readonly repository: PlanillaDeduccionRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const detalleid = req.query.detalleid ? +req.query.detalleid : (req.query.planilladetalleid ? +req.query.planilladetalleid : undefined);

        new GetPlanillaDeduccion(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, detalleid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPlanillaDeduccion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePlanillaDeduccionDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePlanillaDeduccion(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePlanillaDeduccionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePlanillaDeduccion(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePlanillaDeduccion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
