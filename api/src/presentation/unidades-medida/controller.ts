import { Request, Response } from 'express';
import {
    CreateUnidadMedida,
    CreateUnidadMedidaDto,
    DeleteUnidadMedida,
    GetByIdUnidadMedida,
    GetUnidadMedida,
    PaginationDto,
    UnidadMedidaRepository,
    UpdateUnidadMedida,
    UpdateUnidadMedidaDto
} from "../../domain";

export class UnidadesMedidaController {
    constructor(private readonly repository: UnidadMedidaRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetUnidadMedida(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdUnidadMedida(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateUnidadMedidaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateUnidadMedida(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateUnidadMedidaDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateUnidadMedida(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteUnidadMedida(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
