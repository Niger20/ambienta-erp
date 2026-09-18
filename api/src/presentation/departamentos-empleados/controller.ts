import { Request, Response } from 'express';
import {
    CreateDepartamentoEmpleado,
    CreateDepartamentoEmpleadoDto,
    DeleteDepartamentoEmpleado,
    DepartamentoEmpleadoRepository,
    GetByIdDepartamentoEmpleado,
    GetDepartamentoEmpleado,
    PaginationDto,
    UpdateDepartamentoEmpleado,
    UpdateDepartamentoEmpleadoDto
} from "../../domain";

export class DepartamentosEmpleadosController {
    constructor(private readonly repository: DepartamentoEmpleadoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDepartamentoEmpleado(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdDepartamentoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateDepartamentoEmpleadoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateDepartamentoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateDepartamentoEmpleadoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateDepartamentoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteDepartamentoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
