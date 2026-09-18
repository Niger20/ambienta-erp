import { Request, Response } from 'express';
import {
    CreateOrdenCompra,
    CreateOrdenCompraDto,
    DeleteOrdenCompra,
    GetByIdOrdenCompra,
    GetOrdenCompra,
    OrdenCompraRepository,
    PaginationDto,
    UpdateOrdenCompra,
    UpdateOrdenCompraDto
} from "../../domain";

export class OrdenesCompraController {
    constructor(private readonly repository: OrdenCompraRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const proveedorid = req.query.proveedorid ? +req.query.proveedorid : undefined;
        const estado = req.query.estado ? String(req.query.estado) : undefined;

        new GetOrdenCompra(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, proveedorid, estado)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdOrdenCompra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateOrdenCompraDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateOrdenCompra(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateOrdenCompraDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateOrdenCompra(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteOrdenCompra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
