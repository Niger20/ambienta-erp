import { PaginationDto } from "../../domain";
import {Request, Response} from 'express';
import {
    CreateRepartidor,
    CreateRepartidorDto,
    DeleteRepartidor,
    GetByIdRepartidor,
    GetRepartidor,
    RepartidorRepository,
    UpdateRepartidor,
    UpdateRepartidorDto
} from "../../domain";

export class RepartidorController {

    //* DI
    constructor(
        private readonly repository: RepartidorRepository,
    ) {}

    public getRepartidor = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetRepartidor(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(repartidor => res.json(repartidor))
            .catch(err => res.status(400).json({ error: err }));
    }

    public getRepartidorById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        new GetByIdRepartidor(this.repository)
            .execute(id)
            .then(repartidor => res.json(repartidor))
            .catch(err => res.status(400).json({ error: err }));
    }

    public createRepartidor = (req: Request, res: Response) => {
        const [error, createRepartidorDto] = CreateRepartidorDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateRepartidor(this.repository)
            .execute(createRepartidorDto!)
            .then(repartidor => res.json(repartidor))
            .catch(err => res.status(400).json({ error: err }));
    }

    public updateRepartidor = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateRepartidorDto] = UpdateRepartidorDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateRepartidor(this.repository)
            .execute(updateRepartidorDto!)
            .then(repartidor => res.json(repartidor))
            .catch(err => res.status(400).json({ error: err }));
    }

    public deleteRepartidor = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteRepartidor(this.repository)
            .execute(id)
            .then(repartidor => res.json(repartidor))
            .catch(err => res.status(400).json({ error: err }));
    }
}