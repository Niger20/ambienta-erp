import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateCompra,
    CreateCompraDto,
    DeleteCompra,
    GetByIdCompra,
    GetCompra,
    GetDeactivatedCompra,
    CompraRepository,
    UpdateCompra,
    UpdateCompraDto,
    GetPropuesta,
    GetPropuestaGlobal,
} from "../../domain";

const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    return 'Error interno del servidor';
};

export class CompraController {

    constructor(
        private readonly repository: CompraRepository,
    ) { }

    public getCompras = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCompra(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((compras) => res.json(compras))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public getComprasDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedCompra(this.repository)
            .execute()
            .then((compras) => res.json(compras))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public getCompraById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdCompra(this.repository)
            .execute(id)
            .then((compra) => res.json(compra))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public createCompra = (req: Request, res: Response) => {
        const [error, dto] = CreateCompraDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCompra(this.repository)
            .execute(dto!)
            .then((compra) => res.json(compra))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public updateCompra = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateCompraDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCompra(this.repository)
            .execute(dto!)
            .then((compra) => res.json(compra))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public deleteCompra = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteCompra(this.repository)
            .execute(id)
            .then((compra) => res.json(compra))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public getPropuestaPedido = (req: Request, res: Response) => {
        const proveedorId = +req.params.proveedorId;
        if (isNaN(proveedorId)) return res.status(400).json({ error: 'Proveedor ID inválido' });

        new GetPropuesta(this.repository)
            .execute(proveedorId)
            .then((propuesta) => res.json(propuesta))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }

    public getPropuestaPedidoGlobal = (req: Request, res: Response) => {
        new GetPropuestaGlobal(this.repository)
            .execute()
            .then((propuesta) => res.json(propuesta))
            .catch((err) => res.status(400).json({ error: extractErrorMessage(err) }));
    }
}

