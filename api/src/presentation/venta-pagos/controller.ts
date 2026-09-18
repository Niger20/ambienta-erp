import { Request, Response } from 'express';
import {
    CreateVentaPago,
    CreateVentaPagoDto,
    DeleteVentaPago,
    GetByIdVentaPago,
    GetVentaPago,
    PaginationDto,
    UpdateVentaPago,
    UpdateVentaPagoDto,
    VentaPagoRepository
} from "../../domain";

export class VentaPagosController {
    constructor(private readonly repository: VentaPagoRepository) {}

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        const ventaid = req.query.ventaid ? +req.query.ventaid : undefined;

        new GetVentaPago(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit, ventaid)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new GetByIdVentaPago(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateVentaPagoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateVentaPago(this.repository)
            .execute(dto!)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, dto] = UpdateVentaPagoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateVentaPago(this.repository)
            .execute(dto!)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        new DeleteVentaPago(this.repository)
            .execute(id)
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: err }));
    };
}
