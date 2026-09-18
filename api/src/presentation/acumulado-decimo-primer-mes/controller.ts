import { Request, Response } from 'express';
import {
    AcumuladoDecimoPrimerMesRepository,
    CreateAcumuladoDecimoPrimerMes,
    CreateAcumuladoDecimoPrimerMesDto,
    DeleteAcumuladoDecimoPrimerMes,
    GetAcumuladoDecimoPrimerMes,
    GetByIdAcumuladoDecimoPrimerMes,
    PaginationDto,
    UpdateAcumuladoDecimoPrimerMes,
    UpdateAcumuladoDecimoPrimerMesDto
} from "../../domain";

export class AcumuladoDecimoPrimerMesController {
    constructor(private readonly repository: AcumuladoDecimoPrimerMesRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const periodoid = req.query.periodoid ? +req.query.periodoid : undefined;

        new GetAcumuladoDecimoPrimerMes(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, periodoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdAcumuladoDecimoPrimerMes(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAcumuladoDecimoPrimerMesDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAcumuladoDecimoPrimerMes(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateAcumuladoDecimoPrimerMesDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateAcumuladoDecimoPrimerMes(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteAcumuladoDecimoPrimerMes(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
