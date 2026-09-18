import { PaginationDto } from "../../domain";
import { Request, Response, Router } from 'express';
import {

    CreateProducto,
    CreateProductoDto,
    DeleteProducto,
    GetByIdProducto,
    GetByBarcodeProducto,
    GetProducto,
    ProductoRepository,
    UpdateProducto,
    UpdateProductoDto,
    GetDeactivatedProducto,
    SearchProducto,
    RecalculateStockMinimo
} from "../../domain";

export class ProductoController {

    //* DI
    constructor(
        private readonly repository: ProductoRepository,
    ) { }

    public getProducto = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetProducto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getProductoDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedProducto(this.repository)
            .execute()
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getProductoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        new GetByIdProducto(this.repository)
            .execute(id)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getProductoByBarcode = (req: Request, res: Response) => {
        const codigobarra = req.params.codigobarra as string;
        if (!codigobarra) return res.status(400).json({ error: 'Codigo de barra is required' });

        new GetByBarcodeProducto(this.repository)
            .execute(codigobarra)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public searchProducto = (req: Request, res: Response) => {
        const query = (req.query.q as string || '').trim();
        if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

        new SearchProducto(this.repository)
            .execute(query)
            .then((productos) => res.json(productos))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public createProducto = (req: Request, res: Response) => {
        const [error, createProductoDto] = CreateProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateProducto(this.repository)
            .execute(createProductoDto!)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public updateProducto = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateProductoDto] = UpdateProductoDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateProducto(this.repository)
            .execute(updateProductoDto!)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public deleteProducto = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteProducto(this.repository)
            .execute(id)
            .then((producto) => res.json(producto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public recalculateStockMinimo = (req: Request, res: Response) => {
        new RecalculateStockMinimo(this.repository)
            .execute()
            .then(() => res.json({ message: 'Stock mínimo recalculado exitosamente' }))
            .catch((err) => res.status(400).json({ error: err }));
    }
}