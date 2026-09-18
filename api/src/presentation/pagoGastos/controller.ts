import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreatePagoGasto,
    CreatePagoGastoDto,
    DeletePagoGasto,
    GetPagoGasto,
    GetByPagoIdPagoGasto,
    GetByGastoIdPagoGasto,
    PagoGastoRepository,
} from "../../domain";

export class PagoGastoController {

    constructor(
        private readonly repository: PagoGastoRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetPagoGasto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByPagoId = (req: Request, res: Response) => {
        const pagoid = +req.params.pagoid;
        if (isNaN(pagoid)) return res.status(400).json({ error: 'Pago ID invalido' });

        new GetByPagoIdPagoGasto(this.repository)
            .execute(pagoid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByGastoId = (req: Request, res: Response) => {
        const gastoid = +req.params.gastoid;
        if (isNaN(gastoid)) return res.status(400).json({ error: 'Gasto ID invalido' });

        new GetByGastoIdPagoGasto(this.repository)
            .execute(gastoid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePagoGastoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePagoGasto(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const pagoid = +req.params.pagoid;
        const gastoid = +req.params.gastoid;
        if (isNaN(pagoid) || isNaN(gastoid)) {
            return res.status(400).json({ error: 'Pago ID y Gasto ID son obligatorios' });
        }

        new DeletePagoGasto(this.repository)
            .execute(pagoid, gastoid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
