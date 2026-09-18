import { Request, Response } from 'express';
import {
    ConfiguracionInssRepository,
    CreateConfiguracionInss,
    CreateConfiguracionInssDto,
    DeleteConfiguracionInss,
    GetByIdConfiguracionInss,
    GetConfiguracionInss,
    PaginationDto,
    UpdateConfiguracionInss,
    UpdateConfiguracionInssDto
} from "../../domain";

export class ConfiguracionInssController {
    constructor(private readonly repository: ConfiguracionInssRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const activo = req.query.activo !== undefined ? req.query.activo === 'true' : undefined;

        new GetConfiguracionInss(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, activo)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdConfiguracionInss(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateConfiguracionInssDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateConfiguracionInss(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateConfiguracionInssDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateConfiguracionInss(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteConfiguracionInss(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
