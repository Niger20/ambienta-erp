import { Request, Response } from 'express';
import { GetUtilidadDiaria, ReportesRepository, GetUtilidadDiariaDto, GetUtilidadProducto, GetUtilidadProductoDto } from "../../domain";

export class ReportesController {

    constructor(
        private readonly repository: ReportesRepository,
    ) { }

    public getUtilidadDiaria = (req: Request, res: Response) => {
        const [error, getUtilidadDto] = GetUtilidadDiariaDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetUtilidadDiaria(this.repository)
            .execute(getUtilidadDto!.fechaInicio, getUtilidadDto!.fechaFin)
            .then((reporte) => res.json(reporte))
            .catch((err) => res.status(400).json({ error: err }));
    }

    public getUtilidadProducto = (req: Request, res: Response) => {
        const [error, getUtilidadProductoDto] = GetUtilidadProductoDto.create(req.query);
        if (error) return res.status(400).json({ error });

        new GetUtilidadProducto(this.repository)
            .execute(getUtilidadProductoDto!.fechaInicio, getUtilidadProductoDto!.fechaFin)
            .then((productos) => res.json(productos))
            .catch((err) => res.status(400).json({ error: err }));
    }
}
