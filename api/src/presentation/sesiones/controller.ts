import { PaginationDto } from "../../domain";
import { Request, Response } from 'express';
import {
    OpenSesion,
    OpenSesionDto,
    CloseSesion,
    CloseSesionDto,
    GetSesion,
    GetByIdSesion,
    GetActiveSesion,
    GetReporteCierreSesion,
    SesionRepository,
} from "../../domain";

export class SesionController {

    //* DI
    constructor(
        private readonly repository: SesionRepository,
    ) { }

    public getSesiones = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetSesion(this.repository)
            .execute(paginationDto!.page, paginationDto!.limit)
            .then((sesiones) => res.json(sesiones))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getSesionById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetByIdSesion(this.repository)
            .execute(id)
            .then((sesion) => res.json(sesion))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getActiveSesion = (req: Request, res: Response) => {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ error: 'Usuario no autenticado' });

        new GetActiveSesion(this.repository)
            .execute(user.id)
            .then((sesion) => res.json(sesion))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public openSesion = (req: Request, res: Response) => {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ error: 'Usuario no autenticado' });

        const [error, openSesionDto] = OpenSesionDto.create({
            ...req.body,
            usuarioid: user.id,
        });
        if (error) return res.status(400).json({ error });

        new OpenSesion(this.repository)
            .execute(openSesionDto!)
            .then((sesion) => res.json(sesion))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public closeSesion = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, closeSesionDto] = CloseSesionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        new CloseSesion(this.repository)
            .execute(closeSesionDto!)
            .then((sesion) => res.json(sesion))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getReporteCierre = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

        new GetReporteCierreSesion(this.repository)
            .execute(id)
            .then((reporte) => res.json(reporte))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
