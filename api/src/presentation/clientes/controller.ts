import { PaginationDto } from "../../domain";
import {Request, Response} from 'express';
import {
    CreateCliente,
    CreateClienteDto,
    DeleteCliente,
    GetByIdCliente,
    GetCliente,
    ClienteRepository,
    UpdateCliente,
    UpdateClienteDto
} from "../../domain";

export class ClienteController {

    //* DI
    constructor(
        private readonly repository: ClienteRepository,
    ) {}

    public getCliente = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetCliente(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(cliente => res.json(cliente))
            .catch(err => res.status(400).json({ error: err }));
    }

    public getClienteById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        new GetByIdCliente(this.repository)
            .execute(id)
            .then(cliente => res.json(cliente))
            .catch(err => res.status(400).json({ error: err }));
    }


    public createCliente = (req: Request, res: Response) => {

        const [error, createClienteDto] = CreateClienteDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateCliente(this.repository)
            .execute(createClienteDto!)
            .then(cliente => res.json(cliente))
            .catch(err => res.status(400).json({ error: err }));
    }

    public updateCliente = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateClienteDto] = UpdateClienteDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateCliente(this.repository)
            .execute(updateClienteDto!)
            .then(cliente => res.json(cliente))
            .catch(err => res.status(400).json({ error: err }));
    }

    public deleteCliente = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteCliente(this.repository)
            .execute(id)
            .then(cliente => res.json(cliente))
            .catch(err => res.status(400).json({ error: err }));
    }
}