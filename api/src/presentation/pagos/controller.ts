import { PaginationDto } from "../../domain";
import {Request, Response} from 'express';
import {
    CreatePago,
    CreatePagoDto,
    DeletePago,
    GetByIdPago,
    GetPago,
    PagoRepository,
    UpdatePago,
    UpdatePagoDto
} from "../../domain";
import {GetDeactivatedPago} from "../../domain/use-cases/pagos/getDeactivated-pago";

export class PagoController {

    //* DI
    constructor(
        private readonly repository: PagoRepository,
    ) {}

    public getPago = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetPago(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }

    public getPagoDeactivated = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetDeactivatedPago(this.repository)
            .execute()
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }

    public getPagoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        new GetByIdPago(this.repository)
            .execute(id)
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }

    public createPago = (req: Request, res: Response) => {
        const [error, createPagoDto] = CreatePagoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePago(this.repository)
            .execute(createPagoDto!)
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }

    public updatePago = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updatePagoDto] = UpdatePagoDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdatePago(this.repository)
            .execute(updatePagoDto!)
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }

    public deletePago = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeletePago(this.repository)
            .execute(id)
            .then(pago => res.json(pago))
            .catch(err => res.status(400).json({ error: err }));
    }
}