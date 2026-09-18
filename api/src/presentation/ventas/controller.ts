import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateVenta,
    CreateVentaDto,
    DeleteVenta,
    GetByIdVenta,
    GetVenta,
    GetDeactivatedVenta,
    VentaRepository,
    UpdateVenta,
    UpdateVentaDto,
} from "../../domain";

export class VentaController {

    //* DI
    constructor(
        private readonly repository: VentaRepository,
    ) { }

    public getVentas = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetVenta(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((ventas) => res.json(ventas))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getVentasDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedVenta(this.repository)
            .execute()
            .then((ventas) => res.json(ventas))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getVentaById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdVenta(this.repository)
            .execute(id)
            .then((venta) => res.json(venta))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public createVenta = (req: Request, res: Response) => {
        const [error, createVentaDto] = CreateVentaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateVenta(this.repository)
            .execute(createVentaDto!)
            .then((venta) => res.json(venta))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public updateVenta = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateVentaDto] = UpdateVentaDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateVenta(this.repository)
            .execute(updateVentaDto!)
            .then((venta) => res.json(venta))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public deleteVenta = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteVenta(this.repository)
            .execute(id)
            .then((venta) => res.json(venta))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
