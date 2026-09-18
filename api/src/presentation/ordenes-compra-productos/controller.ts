import { Request, Response } from 'express';
import {
    CreateOrdenCompraProducto,
    CreateOrdenCompraProductoDto,
    DeleteOrdenCompraProducto,
    GetByIdOrdenCompraProducto,
    GetOrdenCompraProducto,
    OrdenCompraProductoRepository,
    PaginationDto,
    UpdateOrdenCompraProducto,
    UpdateOrdenCompraProductoDto
} from "../../domain";

export class OrdenesCompraProductosController {
    constructor(private readonly repository: OrdenCompraProductoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const ordencompraid = req.query.ordencompraid ? +req.query.ordencompraid : undefined;

        new GetOrdenCompraProducto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, ordencompraid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const ordencompraid = +req.params.ordencompraid;
        const productoid = +req.params.productoid;
        if (isNaN(ordencompraid) || isNaN(productoid)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }

        new GetByIdOrdenCompraProducto(this.repository)
            .execute(ordencompraid, productoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateOrdenCompraProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateOrdenCompraProducto(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const ordencompraid = +req.params.ordencompraid;
        const productoid = +req.params.productoid;
        const [error, dto] = UpdateOrdenCompraProductoDto.create({ ...req.body, ordencompraid, productoid });
        if (error) return res.status(400).json({ error });

        new UpdateOrdenCompraProducto(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const ordencompraid = +req.params.ordencompraid;
        const productoid = +req.params.productoid;
        if (isNaN(ordencompraid) || isNaN(productoid)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }

        new DeleteOrdenCompraProducto(this.repository)
            .execute(ordencompraid, productoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
