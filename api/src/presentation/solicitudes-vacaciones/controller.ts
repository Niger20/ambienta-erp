import { Request, Response } from 'express';
import {
    CreateSolicitudVacaciones,
    CreateSolicitudVacacionesDto,
    DeleteSolicitudVacaciones,
    GetByIdSolicitudVacaciones,
    GetSolicitudVacaciones,
    PaginationDto,
    SolicitudVacacionesRepository,
    UpdateSolicitudVacaciones,
    UpdateSolicitudVacacionesDto
} from "../../domain";

export class SolicitudesVacacionesController {
    constructor(private readonly repository: SolicitudVacacionesRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetSolicitudVacaciones(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdSolicitudVacaciones(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateSolicitudVacacionesDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateSolicitudVacaciones(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateSolicitudVacacionesDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateSolicitudVacaciones(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteSolicitudVacaciones(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
