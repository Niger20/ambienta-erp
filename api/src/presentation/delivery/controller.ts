import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateDelivery,
    CreateDeliveryDto,
    DeleteDelivery,
    GetByIdDelivery,
    GetDelivery,
    DeliveryRepository,
    UpdateDelivery,
    UpdateDeliveryDto,
    GetDeactivatedDelivery
} from "../../domain";

export class DeliveryController {

    //* DI
    constructor(
        private readonly repository: DeliveryRepository,
    ) { }

    public getDeliveries = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDelivery(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((deliveries) => res.json(deliveries))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getDeliveriesDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedDelivery(this.repository)
            .execute()
            .then((deliveries) => res.json(deliveries))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getDeliveryById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        new GetByIdDelivery(this.repository)
            .execute(id)
            .then((delivery) => res.json(delivery))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public createDelivery = (req: Request, res: Response) => {
        const [error, createDeliveryDto] = CreateDeliveryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateDelivery(this.repository)
            .execute(createDeliveryDto!)
            .then((delivery) => res.json(delivery))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public updateDelivery = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateDeliveryDto] = UpdateDeliveryDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateDelivery(this.repository)
            .execute(updateDeliveryDto!)
            .then((delivery) => res.json(delivery))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public deleteDelivery = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteDelivery(this.repository)
            .execute(id)
            .then((delivery) => res.json(delivery))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
