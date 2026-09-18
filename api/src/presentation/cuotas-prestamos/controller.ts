import { Request, Response } from 'express';
import {
    CreateCuotaPrestamo,
    CreateCuotaPrestamoDto,
    CuotaPrestamoRepository,
    DeleteCuotaPrestamo,
    GetByIdCuotaPrestamo,
    GetCuotaPrestamo,
    PaginationDto,
    UpdateCuotaPrestamo,
    UpdateCuotaPrestamoDto
} from "../../domain";

export class CuotasPrestamosController {
    constructor(private readonly repository: CuotaPrestamoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const prestamoid = req.query.prestamoid ? +req.query.prestamoid : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetCuotaPrestamo(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, prestamoid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdCuotaPrestamo(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCuotaPrestamoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCuotaPrestamo(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateCuotaPrestamoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCuotaPrestamo(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteCuotaPrestamo(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
