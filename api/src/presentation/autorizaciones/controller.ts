import { Request, Response } from 'express';
import {
    // Repository
    AutorizacionRepository,
    // DTOs
    CreateAutorizacionDto,
    // Use Cases
    CreateAutorizacion,
    GetPendientesAutorizaciones,
    AprobarAutorizacion,
    RechazarAutorizacion,
    ValidarCodigoAutorizacion,
    GetEstadoAutorizacion,
} from '../../domain';
import { AutorizacionGateway } from '../../config/ws.adapter';

export class AutorizacionController {

    constructor(
        private readonly autorizacionRepository: AutorizacionRepository,
        private readonly gateway: AutorizacionGateway,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (typeof error === 'string') return res.status(400).json({ error });
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    crear = (req: Request, res: Response) => {
        const usuarioid = (req as any).user?.id ?? (req as any).user?.usuarioid;

        if (!usuarioid) return res.status(400).json({ error: 'Missing user' });

        const [errorDto, createDto] = CreateAutorizacionDto.create({ ...req.body, usuarioid });

        if (errorDto) return res.status(400).json({ error: errorDto });

        new CreateAutorizacion(this.autorizacionRepository)
            .execute(createDto!)
            .then(auth => {
                // Notificar a admins conectados vía WebSocket
                this.gateway.notifyAdmins(auth as any);
                res.status(201).json(auth);
            })
            .catch(error => this.handleError(error, res));
    }

    obtenerPendientes = (req: Request, res: Response) => {
        new GetPendientesAutorizaciones(this.autorizacionRepository)
            .execute()
            .then(auths => res.json(auths))
            .catch(error => this.handleError(error, res));
    }

    aprobar = (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'Invalid ID' });

        new AprobarAutorizacion(this.autorizacionRepository)
            .execute(Number(id))
            .then(result => {
                // Notificar al empleado que está esperando vía WebSocket
                this.gateway.notifyEmpleado(Number(id), 'APROBADO', result.codigo);
                res.json(result);
            })
            .catch(error => this.handleError(error, res));
    }

    rechazar = (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'Invalid ID' });

        new RechazarAutorizacion(this.autorizacionRepository)
            .execute(Number(id))
            .then(auth => {
                // Notificar al empleado que está esperando vía WebSocket
                this.gateway.notifyEmpleado(Number(id), 'RECHAZADO');
                res.json(auth);
            })
            .catch(error => this.handleError(error, res));
    }

    validar = (req: Request, res: Response) => {
        const { codigo, accion } = req.body;

        if (!codigo) return res.status(400).json({ error: 'El código es obligatorio' });

        const accionStr = typeof accion === 'string' && accion.trim() ? accion.trim() : '';

        new ValidarCodigoAutorizacion(this.autorizacionRepository)
            .execute(accionStr, String(codigo))
            .then((isValid: boolean) => {
                if (isValid) {
                    res.json({ valido: true, message: 'Código válido' });
                } else {
                    res.status(400).json({ error: 'Código inválido, expirado o ya utilizado.' });
                }
            })
            .catch((error: unknown) => this.handleError(error, res));
    }

    obtenerEstado = (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'Invalid ID' });

        new GetEstadoAutorizacion(this.autorizacionRepository)
            .execute(Number(id))
            .then((estado: string | null) => {
                if (estado === null) return res.status(404).json({ error: 'Autorización no encontrada' });
                res.json({ estado });
            })
            .catch((error: unknown) => this.handleError(error, res));
    }
}
