import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateAbono,
    CreateAbonoDto,
    DeleteAbono,
    GetAbono,
    GetByIdAbono,
    GetByCuentaIdAbono,
    UpdateAbono,
    UpdateAbonoDto,
    AbonoRepository,
} from "../../domain";

export class AbonoController {

    constructor(
        private readonly repository: AbonoRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetAbono(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdAbono(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getByCuentaId = (req: Request, res: Response) => {
        const cuentaid = +req.params.cuentaid;
        if (isNaN(cuentaid)) return res.status(400).json({ error: 'Cuenta ID invalido' });

        new GetByCuentaIdAbono(this.repository)
            .execute(cuentaid)
            .then((records) => res.json(records))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public create = (req: Request, res: Response) => {
        const [error, dto] = CreateAbonoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateAbono(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public update = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        const [error, dto] = UpdateAbonoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new UpdateAbono(this.repository)
            .execute(dto!)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public delete = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new DeleteAbono(this.repository)
            .execute(id)
            .then((record) => res.json(record))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
