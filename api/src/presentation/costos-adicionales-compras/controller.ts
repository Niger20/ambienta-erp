import { Request, Response } from 'express';
import {
    CostoAdicionalCompraRepository,
    CreateCostoAdicionalCompra,
    CreateCostoAdicionalCompraDto,
    DeleteCostoAdicionalCompra,
    GetByIdCostoAdicionalCompra,
    GetCostoAdicionalCompra,
    PaginationDto,
    UpdateCostoAdicionalCompra,
    UpdateCostoAdicionalCompraDto
} from "../../domain";

export class CostosAdicionalesComprasController {
    constructor(private readonly repository: CostoAdicionalCompraRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const compraid = req.query.compraid ? +req.query.compraid : undefined;

        new GetCostoAdicionalCompra(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, compraid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdCostoAdicionalCompra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateCostoAdicionalCompraDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCostoAdicionalCompra(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateCostoAdicionalCompraDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateCostoAdicionalCompra(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteCostoAdicionalCompra(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
