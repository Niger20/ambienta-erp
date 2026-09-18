import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateMovimientoCompra,
    CreateMovimientoCompraDto,
    DeleteMovimientoCompra,
    GetMovimientoCompra,
    GetByMovimientoIdMovimientoCompra,
    GetByCompraIdMovimientoCompra,
    MovimientoCompraRepository,
} from "../../domain";

export class MovimientoCompraController {

    constructor(
        private readonly repository: MovimientoCompraRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetMovimientoCompra(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByMovimientoId = (req: Request, res: Response) => {
        const movimientocompraid = +req.params.movimientocompraid;
        if (isNaN(movimientocompraid)) return res.status(400).json({ error: 'Movimiento ID invalido' });

        new GetByMovimientoIdMovimientoCompra(this.repository)
            .execute(movimientocompraid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByCompraId = (req: Request, res: Response) => {
        const compraid = +req.params.compraid;
        if (isNaN(compraid)) return res.status(400).json({ error: 'Compra ID invalido' });

        new GetByCompraIdMovimientoCompra(this.repository)
            .execute(compraid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateMovimientoCompraDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateMovimientoCompra(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const movimientocompraid = +req.params.movimientocompraid;
        const compraid = +req.params.compraid;
        if (isNaN(movimientocompraid) || isNaN(compraid)) {
            return res.status(400).json({ error: 'Movimiento ID y Compra ID son obligatorios' });
        }

        new DeleteMovimientoCompra(this.repository)
            .execute(movimientocompraid, compraid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
