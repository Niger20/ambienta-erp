import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateCuentaPorPagar,
    CreateCuentaPorPagarDto,
    DeleteCuentaPorPagar,
    GetCuentaPorPagar,
    GetDeactivatedCuentaPorPagar,
    GetByIdCuentaPorPagar,
    UpdateCuentaPorPagar,
    UpdateCuentaPorPagarDto,
    CuentaPorPagarRepository,
} from "../../domain";

export class CuentaPorPagarController {

    constructor(
        private readonly repository: CuentaPorPagarRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCuentaPorPagar(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedCuentaPorPagar(this.repository)
            .execute()
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdCuentaPorPagar(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCuentaPorPagarDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCuentaPorPagar(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        const [error, dto] = UpdateCuentaPorPagarDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCuentaPorPagar(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new DeleteCuentaPorPagar(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
