import { Request, Response } from 'express';
import {
    CreateRegistroAsistencia,
    CreateRegistroAsistenciaDto,
    DeleteRegistroAsistencia,
    GetByIdRegistroAsistencia,
    GetRegistroAsistencia,
    PaginationDto,
    RegistroAsistenciaRepository,
    UpdateRegistroAsistencia,
    UpdateRegistroAsistenciaDto
} from "../../domain";

export class RegistroAsistenciaController {
    constructor(private readonly repository: RegistroAsistenciaRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const fechaInicio = req.query.fechainicio ? new Date(String(req.query.fechainicio)) : undefined;
        const fechaFin = req.query.fechafin ? new Date(String(req.query.fechafin)) : undefined;

        new GetRegistroAsistencia(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, fechaInicio, fechaFin)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdRegistroAsistencia(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateRegistroAsistenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateRegistroAsistencia(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateRegistroAsistenciaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateRegistroAsistencia(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteRegistroAsistencia(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
