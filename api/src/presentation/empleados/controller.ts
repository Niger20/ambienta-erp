import { Request, Response } from 'express';
import {
    CreateEmpleado,
    CreateEmpleadoDto,
    DeleteEmpleado,
    EmpleadoRepository,
    GetByIdEmpleado,
    GetDeactivatedEmpleado,
    GetEmpleado,
    PaginationDto,
    UpdateEmpleado,
    UpdateEmpleadoDto
} from "../../domain";

export class EmpleadosController {
    constructor(private readonly repository: EmpleadoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const cargoid = req.query.cargoid ? +req.query.cargoid : undefined;
        let estado: boolean | undefined = true;
        if (req.query.estado !== undefined) {
            estado = req.query.estado === 'true' ? true : (req.query.estado === 'false' ? false : undefined);
        }

        new GetEmpleado(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, cargoid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getDeactivated = (req: Request, res: Response) => {
        new GetDeactivatedEmpleado(this.repository)
            .execute()
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateEmpleadoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateEmpleadoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateEmpleado(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteEmpleado(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
