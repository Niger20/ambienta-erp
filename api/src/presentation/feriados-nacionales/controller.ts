import { Request, Response } from 'express';
import {
    CreateFeriadoNacional,
    CreateFeriadoNacionalDto,
    DeleteFeriadoNacional,
    FeriadoNacionalRepository,
    GetByIdFeriadoNacional,
    GetFeriadoNacional,
    PaginationDto,
    UpdateFeriadoNacional,
    UpdateFeriadoNacionalDto
} from "../../domain";

export class FeriadosNacionalesController {
    constructor(private readonly repository: FeriadoNacionalRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const anio = req.query.anio ? +req.query.anio : undefined;

        new GetFeriadoNacional(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, anio)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdFeriadoNacional(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateFeriadoNacionalDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateFeriadoNacional(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateFeriadoNacionalDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateFeriadoNacional(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteFeriadoNacional(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
