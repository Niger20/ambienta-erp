import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateMovimientoVenta,
    CreateMovimientoVentaDto,
    DeleteMovimientoVenta,
    GetMovimientoVenta,
    GetByMovimientoIdMovimientoVenta,
    GetByVentaIdMovimientoVenta,
    MovimientoVentaRepository,
} from "../../domain";

export class MovimientoVentaController {

    constructor(
        private readonly repository: MovimientoVentaRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetMovimientoVenta(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByMovimientoId = (req: Request, res: Response) => {
        const movimeintoventaid = +req.params.movimeintoventaid;
        if (isNaN(movimeintoventaid)) return res.status(400).json({ error: 'Movimiento ID invalido' });

        new GetByMovimientoIdMovimientoVenta(this.repository)
            .execute(movimeintoventaid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByVentaId = (req: Request, res: Response) => {
        const ventaid = +req.params.ventaid;
        if (isNaN(ventaid)) return res.status(400).json({ error: 'Venta ID invalido' });

        new GetByVentaIdMovimientoVenta(this.repository)
            .execute(ventaid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateMovimientoVentaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateMovimientoVenta(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const movimeintoventaid = +req.params.movimeintoventaid;
        const ventaid = +req.params.ventaid;
        if (isNaN(movimeintoventaid) || isNaN(ventaid)) {
            return res.status(400).json({ error: 'Movimiento ID y Venta ID son obligatorios' });
        }

        new DeleteMovimientoVenta(this.repository)
            .execute(movimeintoventaid, ventaid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
