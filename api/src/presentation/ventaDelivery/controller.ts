import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateVentaDelivery,
    CreateVentaDeliveryDto,
    DeleteVentaDelivery,
    GetVentaDelivery,
    GetByVentaIdVentaDelivery,
    GetByDeliveryIdVentaDelivery,
    VentaDeliveryRepository,
} from "../../domain";

export class VentaDeliveryController {

    //* DI
    constructor(
        private readonly repository: VentaDeliveryRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetVentaDelivery(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByVentaId = (req: Request, res: Response) => {
        const ventaid = +req.params.ventaid;
        if (isNaN(ventaid)) return res.status(400).json({ error: 'Venta ID invalido' });

        new GetByVentaIdVentaDelivery(this.repository)
            .execute(ventaid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByDeliveryId = (req: Request, res: Response) => {
        const deliveryid = +req.params.deliveryid;
        if (isNaN(deliveryid)) return res.status(400).json({ error: 'Delivery ID invalido' });

        new GetByDeliveryIdVentaDelivery(this.repository)
            .execute(deliveryid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateVentaDeliveryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateVentaDelivery(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const ventaid = +req.params.ventaid;
        const deliveryid = +req.params.deliveryid;
        if (isNaN(ventaid) || isNaN(deliveryid)) {
            return res.status(400).json({ error: 'Venta ID y Delivery ID son obligatorios' });
        }

        new DeleteVentaDelivery(this.repository)
            .execute(ventaid, deliveryid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
