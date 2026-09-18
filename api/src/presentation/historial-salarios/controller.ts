import { Request, Response } from 'express';
import {
    CreateHistorialSalario,
    CreateHistorialSalarioDto,
    DeleteHistorialSalario,
    GetByIdHistorialSalario,
    GetHistorialSalario,
    HistorialSalarioRepository,
    PaginationDto,
    UpdateHistorialSalario,
    UpdateHistorialSalarioDto
} from "../../domain";

export class HistorialSalariosController {
    constructor(private readonly repository: HistorialSalarioRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;

        new GetHistorialSalario(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdHistorialSalario(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateHistorialSalarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateHistorialSalario(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateHistorialSalarioDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateHistorialSalario(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteHistorialSalario(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
