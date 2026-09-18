import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateCuentaPorCobrar,
    CreateCuentaPorCobrarDto,
    DeleteCuentaPorCobrar,
    GetCuentaPorCobrar,
    GetDeactivatedCuentaPorCobrar,
    GetByIdCuentaPorCobrar,
    UpdateCuentaPorCobrar,
    UpdateCuentaPorCobrarDto,
    CuentaPorCobrarRepository,
} from "../../domain";

export class CuentaPorCobrarController {

    constructor(
        private readonly repository: CuentaPorCobrarRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCuentaPorCobrar(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedCuentaPorCobrar(this.repository)
            .execute()
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdCuentaPorCobrar(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCuentaPorCobrarDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCuentaPorCobrar(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        const [error, dto] = UpdateCuentaPorCobrarDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCuentaPorCobrar(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new DeleteCuentaPorCobrar(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
