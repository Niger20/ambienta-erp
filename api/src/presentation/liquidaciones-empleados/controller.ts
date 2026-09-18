import { Request, Response } from 'express';
import {
    CreateLiquidacionEmpleado,
    CreateLiquidacionEmpleadoDto,
    DeleteLiquidacionEmpleado,
    GetByIdLiquidacionEmpleado,
    GetLiquidacionEmpleado,
    LiquidacionEmpleadoRepository,
    PaginationDto,
    UpdateLiquidacionEmpleado,
    UpdateLiquidacionEmpleadoDto
} from "../../domain";

export class LiquidacionesEmpleadosController {
    constructor(private readonly repository: LiquidacionEmpleadoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetLiquidacionEmpleado(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdLiquidacionEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateLiquidacionEmpleadoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateLiquidacionEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateLiquidacionEmpleadoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateLiquidacionEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteLiquidacionEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
