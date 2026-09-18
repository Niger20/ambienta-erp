import { Request, Response } from 'express';
import {
    CategoriaClienteRepository,
    CreateCategoriaCliente,
    CreateCategoriaClienteDto,
    DeleteCategoriaCliente,
    GetByIdCategoriaCliente,
    GetCategoriaCliente,
    PaginationDto,
    UpdateCategoriaCliente,
    UpdateCategoriaClienteDto
} from "../../domain";

export class CategoriasClientesController {
    constructor(private readonly repository: CategoriaClienteRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCategoriaCliente(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdCategoriaCliente(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCategoriaClienteDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCategoriaCliente(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateCategoriaClienteDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCategoriaCliente(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteCategoriaCliente(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
