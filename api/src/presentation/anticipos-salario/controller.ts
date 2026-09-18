import { Request, Response } from 'express';
import {
    AnticipoSalarioRepository,
    CreateAnticipoSalario,
    CreateAnticipoSalarioDto,
    DeleteAnticipoSalario,
    GetAnticipoSalario,
    GetByIdAnticipoSalario,
    PaginationDto,
    UpdateAnticipoSalario,
    UpdateAnticipoSalarioDto
} from "../../domain";

export class AnticiposSalarioController {
    constructor(private readonly repository: AnticipoSalarioRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const mes = req.query.mes ? +req.query.mes : undefined;
        const anio = req.query.anio ? +req.query.anio : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetAnticipoSalario(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, mes, anio, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdAnticipoSalario(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAnticipoSalarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAnticipoSalario(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateAnticipoSalarioDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateAnticipoSalario(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteAnticipoSalario(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
