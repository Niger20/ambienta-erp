import { PaginationDto } from "../../domain";
import {Request, Response} from 'express';
import {
    CreateEmpresa,
    CreateEmpresaDto,
    EmpresaRepository,
    GetEmpresa,
    UpdateEmpresa,
    UpdateEmpresaDto
} from "../../domain";

export class EmpresaController {

    //* DI
    constructor(
        private readonly repository: EmpresaRepository,
    ) {}

    public getEmpresa = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetEmpresa(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then(empresa => res.json(empresa))
            .catch(err => res.status(400).json({ error: err }));
    }

    public createEmpresa = (req: Request, res: Response) => {
        const [error, createEmpresaDto] = CreateEmpresaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateEmpresa(this.repository)
            .execute(createEmpresaDto!)
            .then(empresa => res.json(empresa))
            .catch(err => res.status(400).json({ error: err }));
    }

    public updateEmpresa = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateEmpresaDto] = UpdateEmpresaDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        new UpdateEmpresa(this.repository)
            .execute(updateEmpresaDto!)
            .then(empresa => res.json(empresa))
            .catch(err => res.status(400).json({ error: err }));
    }
}