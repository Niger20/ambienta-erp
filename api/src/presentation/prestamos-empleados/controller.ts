import { Request, Response } from 'express';
import {
    CreatePrestamoEmpleado,
    CreatePrestamoEmpleadoDto,
    DeletePrestamoEmpleado,
    GetByIdPrestamoEmpleado,
    GetPrestamoEmpleado,
    PaginationDto,
    PrestamoEmpleadoRepository,
    UpdatePrestamoEmpleado,
    UpdatePrestamoEmpleadoDto
} from "../../domain";

export class PrestamosEmpleadosController {
    constructor(private readonly repository: PrestamoEmpleadoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetPrestamoEmpleado(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPrestamoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePrestamoEmpleadoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePrestamoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePrestamoEmpleadoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePrestamoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePrestamoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
