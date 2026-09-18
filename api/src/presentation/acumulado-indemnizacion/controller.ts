import { Request, Response } from 'express';
import {
    AcumuladoIndemnizacionRepository,
    CreateAcumuladoIndemnizacion,
    CreateAcumuladoIndemnizacionDto,
    DeleteAcumuladoIndemnizacion,
    GetAcumuladoIndemnizacion,
    GetByIdAcumuladoIndemnizacion,
    PaginationDto,
    UpdateAcumuladoIndemnizacion,
    UpdateAcumuladoIndemnizacionDto
} from "../../domain";

export class AcumuladoIndemnizacionController {
    constructor(private readonly repository: AcumuladoIndemnizacionRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const periodoid = req.query.periodoid ? +req.query.periodoid : undefined;

        new GetAcumuladoIndemnizacion(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, periodoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdAcumuladoIndemnizacion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAcumuladoIndemnizacionDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAcumuladoIndemnizacion(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateAcumuladoIndemnizacionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateAcumuladoIndemnizacion(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteAcumuladoIndemnizacion(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
