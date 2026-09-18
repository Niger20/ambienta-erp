import { Request, Response } from 'express';
import {
    CreatePagoBeneficio,
    CreatePagoBeneficioDto,
    DeletePagoBeneficio,
    GetByIdPagoBeneficio,
    GetPagoBeneficio,
    PaginationDto,
    PagoBeneficioRepository,
    UpdatePagoBeneficio,
    UpdatePagoBeneficioDto
} from "../../domain";

export class PagosBeneficiosController {
    constructor(private readonly repository: PagoBeneficioRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const empleadoid = req.query.empleadoid ? +req.query.empleadoid : undefined;
        const tipobeneficio = req.query.tipobeneficio ? String(req.query.tipobeneficio) : undefined;

        new GetPagoBeneficio(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, empleadoid, tipobeneficio)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdPagoBeneficio(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePagoBeneficioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePagoBeneficio(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdatePagoBeneficioDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdatePagoBeneficio(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeletePagoBeneficio(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
