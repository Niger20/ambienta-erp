import { WsClient, WsAdapter } from './ws.adapter';
import { AutorizacionEntity } from '../../domain/entitites/autorizacion.entity';

type WsMessage = {
    type: string;
    [key: string]: unknown;
};

export class AutorizacionGateway {

    private adminClients = new Set<WsClient>();
    // Map: autorizacionid → empleado WebSocket
    private empleadoClients = new Map<number, WsClient>();

    constructor(private readonly wsAdapter: WsAdapter) {
        this.wsAdapter.onConnection((ws) => this.handleConnection(ws));
    }

    // ── Connection handler ────────────────────────────────────────────────────

    private handleConnection(ws: WsClient): void {
        ws.on('message', (raw) => {
            try {
                const msg: WsMessage = JSON.parse(raw.toString());
                this.handleMessage(ws, msg);
            } catch {
                // Ignore malformed messages
            }
        });

        ws.on('close', () => this.removeClient(ws));
        ws.on('error', ()  => this.removeClient(ws));
    }

    private handleMessage(ws: WsClient, msg: WsMessage): void {
        switch (msg.type) {

            case 'subscribe_admin':
                this.adminClients.add(ws);
                this.send(ws, { type: 'subscribed', role: 'admin' });
                break;

            case 'subscribe_empleado': {
                const authId = Number(msg.autorizacionid);
                if (!isNaN(authId)) {
                    this.empleadoClients.set(authId, ws);
                    this.send(ws, { type: 'subscribed', role: 'empleado', autorizacionid: authId });
                }
                break;
            }

            case 'ping':
                this.send(ws, { type: 'pong' });
                break;
        }
    }

    private removeClient(ws: WsClient): void {
        this.adminClients.delete(ws);
        for (const [id, client] of this.empleadoClients.entries()) {
            if (client === ws) {
                this.empleadoClients.delete(id);
                break;
            }
        }
    }

    // ── Notification methods (called from controller) ─────────────────────────

    /** Notifica a todos los admins conectados de una nueva solicitud de autorización */
    notifyAdmins(autorizacion: AutorizacionEntity & { nombreusuario?: string }): void {
        const payload = {
            type: 'NUEVA_SOLICITUD',
            autorizacion: {
                autorizacionid: autorizacion.autorizacionid,
                usuarioid:      autorizacion.usuarioid,
                accion:         autorizacion.accion,
                detalle:        autorizacion.detalle,
                estado:         autorizacion.estado,
                fecha:          autorizacion.fecha,
                nombreusuario:  autorizacion.nombreusuario,
            }
        };
        this.broadcast(this.adminClients, payload);
    }

    /** Notifica al empleado que está esperando la resolución de su autorización */
    notifyEmpleado(autorizacionid: number, estado: 'APROBADO' | 'RECHAZADO', codigo?: string): void {
        const ws = this.empleadoClients.get(autorizacionid);
        if (!ws) return;

        this.send(ws, { type: 'ESTADO_ACTUALIZADO', autorizacionid, estado, codigo });
        // Limpiar: la conexión ya cumplió su propósito
        this.empleadoClients.delete(autorizacionid);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private send(ws: WsClient, data: object): void {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    private broadcast(clients: Set<WsClient>, data: object): void {
        const payload = JSON.stringify(data);
        for (const client of clients) {
            if (client.readyState === client.OPEN) {
                client.send(payload);
            }
        }
    }
}
