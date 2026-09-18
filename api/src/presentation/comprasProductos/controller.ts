import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateCompraProducto,
    CreateCompraProductoDto,
    DeleteCompraProducto,
    GetCompraProducto,
    GetByCompraIdCompraProducto,
    CompraProductoRepository,
} from "../../domain";

const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    return 'Error interno del servidor';
};

export class CompraProductoController {

    constructor(
        private readonly repository: CompraProductoRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCompraProducto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public getByCompraId = (req: Request, res: Response) => {
        const compraid = +req.params.compraid;
        if (isNaN(compraid)) return res.status(400).json({ error: 'Compra ID invalido' });

        new GetByCompraIdCompraProducto(this.repository)
            .execute(compraid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCompraProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCompraProducto(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public delete = (req: Request, res: Response) => {
        const compraid = +req.params.compraid;
        const productoid = +req.params.productoid;
        if (isNaN(compraid) || isNaN(productoid)) {
            return res.status(400).json({ error: 'Compra ID y Producto ID son obligatorios' });
        }

        new DeleteCompraProducto(this.repository)
            .execute(compraid, productoid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }
}

