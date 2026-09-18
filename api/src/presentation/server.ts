import express, { type Router } from 'express';
import http from 'http';
import path from 'path';
import { CorsAdapter } from '../config/cors.adapter';
import { HelmetAdapter } from '../config/helmet.adapter';
import { RateLimitAdapter } from '../config/rate-limit.adapter';
import { WsAdapter, AutorizacionGateway } from '../config/ws.adapter';

interface Options {
    port: number;
    routes: (gateway: AutorizacionGateway) => Router;
    public_path: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routesFactory: (gateway: AutorizacionGateway) => Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = path.resolve(process.cwd(), public_path);
        this.routesFactory = routes;
    }

    async start() {

        //* Confiar en el primer proxy (balanceador de la plataforma de hosting)
        //* para que express-rate-limit identifique la IP real del cliente vía X-Forwarded-For
        this.app.set('trust proxy', 1);

        //* Security Headers
        this.app.use(HelmetAdapter.middleware);

        //* CORS (lista blanca de orígenes, útil solo en desarrollo)
        this.app.use(CorsAdapter.middleware);

        //* Rate limiting estricto en login
        this.app.use('/api/auth/login', RateLimitAdapter.authLimiter);

        //* Body parsing
        this.app.use(express.json({ limit: '1mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));

        //* Archivos estáticos del frontend (React/Vite build)
        this.app.use(express.static(this.publicPath));

        //* Crear servidor HTTP (necesario para compartir con WebSocket)
        const httpServer = http.createServer(this.app);

        //* WebSocket — Gateway de Autorizaciones
        const wsAdapter  = new WsAdapter(httpServer);
        const gateway    = new AutorizacionGateway(wsAdapter);

        //* Rutas del API (recibe el gateway para inyectarlo en AutorizacionRoutes)
        this.app.use(this.routesFactory(gateway));

        //* SPA Fallback — cualquier ruta que no sea /api/* sirve el index.html
        this.app.get(/^(?!\/api).*$/, (_req, res) => {
            const indexPath = path.join(this.publicPath, 'index.html');
            res.sendFile(indexPath);
        });

        httpServer.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
            console.log(`WebSocket ready at ws://localhost:${this.port}/ws/autorizaciones`);
        });
    }

}
