import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateVentaProducto,
    CreateVentaProductoDto,
    DeleteVentaProducto,
    GetVentaProducto,
    GetByVentaIdVentaProducto,
    VentaProductoRepository,
} from "../../domain";

export class VentaProductoController {

    //* DI
    constructor(
        private readonly repository: VentaProductoRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetVentaProducto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByVentaId = (req: Request, res: Response) => {
        const ventaid = +req.params.ventaid;
        if (isNaN(ventaid)) return res.status(400).json({ error: 'Venta ID invalido' });

        new GetByVentaIdVentaProducto(this.repository)
            .execute(ventaid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateVentaProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateVentaProducto(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const ventaid = +req.params.ventaid;
        const productoid = +req.params.productoid;
        if (isNaN(ventaid) || isNaN(productoid)) {
            return res.status(400).json({ error: 'Venta ID y Producto ID son obligatorios' });
        }

        new DeleteVentaProducto(this.repository)
            .execute(ventaid, productoid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
