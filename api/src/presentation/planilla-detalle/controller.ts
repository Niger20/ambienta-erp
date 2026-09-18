import { Request, Response } from 'express';
import {
    CreatePlanillaDetalle,
    CreatePlanillaDetalleDto,
    DeletePlanillaDetalle,
    GetByIdPlanillaDetalle,
    GetPlanillaDetalle,
    PaginationDto,
    PlanillaDetalleRepository,
    UpdatePlanillaDetalle,
    UpdatePlanillaDetalleDto
} from "../../domain";

export class PlanillaDetalleController {
    constructor(private readonly repository: PlanillaDetalleRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const periodoid = req.query.periodoid ? +req.query.periodoid : undefined;
        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;

        new GetPlanillaDetalle(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, periodoid, empleadoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPlanillaDetalle(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePlanillaDetalleDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePlanillaDetalle(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePlanillaDetalleDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePlanillaDetalle(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePlanillaDetalle(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
