import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateMovimientoInventario,
    CreateMovimientoInventarioDto,
    DeleteMovimientoInventario,
    GetMovimientoInventario,
    GetByIdMovimientoInventario,
    GetByProductoIdMovimientoInventario,
    MovimientoInventarioRepository,
} from "../../domain";

export class MovimientoInventarioController {

    constructor(
        private readonly repository: MovimientoInventarioRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetMovimientoInventario(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdMovimientoInventario(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByProductoId = (req: Request, res: Response) => {
        const productoid = +req.params.productoid;
        if (isNaN(productoid)) return res.status(400).json({ error: 'Producto ID invalido' });

        new GetByProductoIdMovimientoInventario(this.repository)
            .execute(productoid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateMovimientoInventarioDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateMovimientoInventario(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteMovimientoInventario(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
