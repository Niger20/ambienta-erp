import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage, Server } from 'http';

export type WsClient = WebSocket;

export class WsAdapter {

    private wss: WebSocketServer;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server, path: '/ws/autorizaciones' });
    }

    get server(): WebSocketServer {
        return this.wss;
    }

    onConnection(handler: (ws: WsClient, req: IncomingMessage) => void): void {
        this.wss.on('connection', handler);
    }

    close(): void {
        this.wss.close();
    }
}
