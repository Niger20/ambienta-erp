import { Request, Response } from 'express';
import {
    CargoEmpleadoRepository,
    CreateCargoEmpleado,
    CreateCargoEmpleadoDto,
    DeleteCargoEmpleado,
    GetByIdCargoEmpleado,
    GetCargoEmpleado,
    PaginationDto,
    UpdateCargoEmpleado,
    UpdateCargoEmpleadoDto
} from "../../domain";

export class CargosEmpleadosController {
    constructor(private readonly repository: CargoEmpleadoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const departamentoid = req.query.departamentoid ? +req.query.departamentoid : undefined;

        new GetCargoEmpleado(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, departamentoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdCargoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCargoEmpleadoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCargoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateCargoEmpleadoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCargoEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteCargoEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
