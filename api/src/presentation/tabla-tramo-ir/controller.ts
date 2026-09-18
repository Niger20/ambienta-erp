import { Request, Response } from 'express';
import {
    CreateTablaTramoIr,
    CreateTablaTramoIrDto,
    DeleteTablaTramoIr,
    GetByIdTablaTramoIr,
    GetTablaTramoIr,
    PaginationDto,
    TablaTramoIrRepository,
    UpdateTablaTramoIr,
    UpdateTablaTramoIrDto
} from "../../domain";

export class TablaTramoIrController {
    constructor(private readonly repository: TablaTramoIrRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const activo = req.query.activo !== undefined ? req.query.activo === 'true' : undefined;

        new GetTablaTramoIr(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, activo)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdTablaTramoIr(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateTablaTramoIrDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateTablaTramoIr(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateTablaTramoIrDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateTablaTramoIr(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteTablaTramoIr(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
