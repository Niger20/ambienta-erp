import { Request, Response } from 'express';
import {
    AcumuladoVacacionesRepository,
    CreateAcumuladoVacaciones,
    CreateAcumuladoVacacionesDto,
    DeleteAcumuladoVacaciones,
    GetAcumuladoVacaciones,
    GetByIdAcumuladoVacaciones,
    PaginationDto,
    UpdateAcumuladoVacaciones,
    UpdateAcumuladoVacacionesDto
} from "../../domain";

export class AcumuladoVacacionesController {
    constructor(private readonly repository: AcumuladoVacacionesRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const periodoid = req.query.periodoid ? +req.query.periodoid : undefined;

        new GetAcumuladoVacaciones(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, periodoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdAcumuladoVacaciones(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAcumuladoVacacionesDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAcumuladoVacaciones(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateAcumuladoVacacionesDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateAcumuladoVacaciones(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteAcumuladoVacaciones(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
