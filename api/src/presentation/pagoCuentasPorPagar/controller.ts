import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreatePagoCuentaPorPagar,
    CreatePagoCuentaPorPagarDto,
    DeletePagoCuentaPorPagar,
    GetPagoCuentaPorPagar,
    GetByPagoIdPagoCuentaPorPagar,
    GetByCuentaPagarIdPagoCuentaPorPagar,
    PagoCuentaPorPagarRepository,
} from "../../domain";

export class PagoCuentaPorPagarController {

    constructor(
        private readonly repository: PagoCuentaPorPagarRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetPagoCuentaPorPagar(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByPagoId = (req: Request, res: Response) => {
        const pagoid = +req.params.pagoid;
        if (isNaN(pagoid)) return res.status(400).json({ error: 'Pago ID invalido' });

        new GetByPagoIdPagoCuentaPorPagar(this.repository)
            .execute(pagoid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByCuentaPagarId = (req: Request, res: Response) => {
        const cuentapagarid = +req.params.cuentapagarid;
        if (isNaN(cuentapagarid)) return res.status(400).json({ error: 'Cuenta Pagar ID invalido' });

        new GetByCuentaPagarIdPagoCuentaPorPagar(this.repository)
            .execute(cuentapagarid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreatePagoCuentaPorPagarDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreatePagoCuentaPorPagar(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const pagoid = +req.params.pagoid;
        const cuentapagarid = +req.params.cuentapagarid;
        if (isNaN(pagoid) || isNaN(cuentapagarid)) {
            return res.status(400).json({ error: 'Pago ID y Cuenta Pagar ID son obligatorios' });
        }

        new DeletePagoCuentaPorPagar(this.repository)
            .execute(pagoid, cuentapagarid)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
