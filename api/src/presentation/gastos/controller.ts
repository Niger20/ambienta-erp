import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    CreateGasto,
    CreateGastoDto,
    DeleteGasto,
    GetByIdGasto,
    GetGasto,
    GastoRepository,
    UpdateGasto,
    UpdateGastoDto,
} from "../../domain";

export class GastoController {

    //* DI
    constructor(
        private readonly repository: GastoRepository,
    ) { }

    public getGastos = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetGasto(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((gastos) => res.json(gastos))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getGastoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdGasto(this.repository)
            .execute(id)
            .then((gasto) => res.json(gasto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public createGasto = (req: Request, res: Response) => {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ error: 'Usuario no autenticado' });

        const [error, createGastoDto] = CreateGastoDto.create({
            ...req.body,
            usuarioid: user.id,
        });
        if (error) return res.status(400).json({ error });

        new CreateGasto(this.repository)
            .execute(createGastoDto!)
            .then((gasto) => res.json(gasto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public updateGasto = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateGastoDto] = UpdateGastoDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateGasto(this.repository)
            .execute(updateGastoDto!)
            .then((gasto) => res.json(gasto))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public deleteGasto = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteGasto(this.repository)
            .execute(id)
            .then((gasto) => res.json(gasto))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
