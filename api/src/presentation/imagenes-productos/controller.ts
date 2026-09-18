import { Request, Response } from 'express';
import {
    CreateImagenProducto,
    CreateImagenProductoDto,
    DeleteImagenProducto,
    GetByIdImagenProducto,
    GetImagenProducto,
    ImagenProductoRepository,
    PaginationDto,
    UpdateImagenProducto,
    UpdateImagenProductoDto
} from "../../domain";

export class ImagenesProductosController {
    constructor(private readonly repository: ImagenProductoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const productoid = req.query.productoid ? +req.query.productoid : undefined;

        new GetImagenProducto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, productoid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdImagenProducto(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateImagenProductoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateImagenProducto(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateImagenProductoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateImagenProducto(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteImagenProducto(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
