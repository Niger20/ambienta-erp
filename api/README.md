# 🛒 La Catracha — API REST

Backend del sistema de punto de venta **La Catracha**. Gestiona ventas, inventario, compras, cuentas por cobrar/pagar, deliveries y más. Construido con **Clean Architecture**, **Node.js 22**, **Express 5**, **Prisma 7** y **PostgreSQL 15**.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación Local](#-instalación-local)
- [Despliegue con Docker](#-despliegue-con-docker)
- [Scripts Disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
- [WebSocket — Autorizaciones en Tiempo Real](#-websocket--autorizaciones-en-tiempo-real)
- [Sistema de Autorización](#-sistema-de-autorización)
- [Autenticación y Roles](#-autenticación-y-roles)

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 20.19 | Runtime |
| TypeScript | ^5.9 | Lenguaje principal |
| Express | ^5.2 | Framework HTTP |
| Prisma | ^7.3 | ORM |
| PostgreSQL | 15 | Base de datos |
| bcrypt | ^6.0 | Hash de contraseñas |
| jsonwebtoken | ^9.0 | Autenticación JWT |
| ws | ^8.19 | WebSocket nativo (servidor) |
| helmet | ^8.1 | Seguridad HTTP headers |
| express-rate-limit | ^8.3 | Rate limiting |
| cors | ^2.8 | Cross-Origin Resource Sharing |
| dotenv / env-var | ^17 / ^7.5 | Variables de entorno tipadas |
| ts-node-dev | ^2.0 | Hot-reload en desarrollo |
| Docker / Docker Compose | — | Contenedorización completa |

---

## 🏛️ Arquitectura

El proyecto implementa **Clean Architecture** con cuatro capas bien definidas:

```
src/
├── domain/          ← Núcleo: entidades, repositorios abstractos, use cases, DTOs
├── infrastructure/  ← Implementaciones concretas: datasources, repositorios, websocket
├── presentation/    ← Capa HTTP + WebSocket: controllers, routes (Express)
└── config/          ← Configuración: variables de entorno, adaptadores (JWT, bcrypt, ws)
```

### Flujo de una petición HTTP

```
HTTP Request
    │
    ▼
[Presentation Layer]   routes.ts → controller.ts
    │  instancia use case con repository
    ▼
[Domain Layer]         Use Case → Repository (abstracto)
    │  delega al datasource concreto
    ▼
[Infrastructure Layer] Repository Impl → Datasource Impl → Prisma
    │
    ▼
PostgreSQL
```

### Flujo de evento WebSocket (Autorizaciones)

```
Empleado  ──POST /api/autorizaciones──►  Controller (REST)
                                              │ gateway.notifyAdmins()
                                              ▼
                                    AutorizacionGateway (WS)
                                              │ broadcast a admins conectados
                                              ▼
Admin     ◄──── ws: NUEVA_SOLICITUD ─────────┘

Admin     ──PUT /api/autorizaciones/:id/aprobar──►  Controller (REST)
                                                        │ gateway.notifyEmpleado()
                                                        ▼
                                             AutorizacionGateway (WS)
                                                        │
Empleado  ◄── ws: ESTADO_ACTUALIZADO (APROBADO) ───────┘
```

### Principios clave

- **Dependency Inversion**: Los use cases dependen de abstracciones (`AutorizacionRepository`), nunca de implementaciones.
- **Single Responsibility**: Cada use case hace exactamente una cosa (`CreateAutorizacion`, `AprobarAutorizacion`, etc.).
- **Barrel exports**: Todo el dominio se expone a través de `src/domain/index.ts` — los controllers nunca importan de paths internos del dominio.

---

## 📁 Estructura del Proyecto

```
api/
├── prisma/
│   └── schema.prisma             # Esquema completo de la BD
├── src/
│   ├── app.ts                    # Entry point
│   ├── config/
│   │   ├── envs.ts               # Variables de entorno tipadas (env-var)
│   │   ├── jwt.adapter.ts        # Re-export de JwtAdapter
│   │   ├── bcrypt.adapter.ts     # Re-export de BcryptAdapter
│   │   └── ws.adapter.ts         # Re-export de WsAdapter + AutorizacionGateway
│   ├── data/
│   │   └── postgres/             # Cliente Prisma singleton
│   ├── domain/
│   │   ├── index.ts              # Barrel export de todo el dominio
│   │   ├── datasources/          # Interfaces abstractas de datasources
│   │   ├── repositories/         # Interfaces abstractas de repositorios
│   │   ├── entitites/            # Entidades de dominio
│   │   ├── dtos/                 # Data Transfer Objects (validación de entrada)
│   │   ├── use-cases/            # Casos de uso (lógica de negocio)
│   │   ├── enums/                # Enums (roles de usuario)
│   │   └── services/             # Servicios abstractos (hashing, tokens)
│   ├── infrastructure/
│   │   ├── datasource/           # Implementaciones Prisma de los datasources
│   │   ├── repositories/         # Implementaciones de los repositorios
│   │   ├── middlewares/          # Middleware de autenticación JWT
│   │   ├── auth/                 # Adaptadores JWT y bcrypt
│   │   ├── websocket/            # WsAdapter + AutorizacionGateway
│   │   └── factories/            # Fábricas de middlewares
│   └── presentation/
│       ├── routes.ts             # Router principal (recibe AutorizacionGateway)
│       ├── server.ts             # Clase Server (http.createServer + WsAdapter)
│       ├── auth/                 # Módulo de autenticación y usuarios
│       ├── ventas/               # Módulo de ventas
│       ├── ventaProductos/       # Detalle de productos por venta
│       ├── ventaDelivery/        # Relación venta ↔ delivery
│       ├── producto/             # Módulo de productos
│       ├── categoria-productos/  # Categorías de productos
│       ├── compras/              # Compras a proveedores
│       ├── comprasProductos/     # Detalle de productos por compra
│       ├── clientes/             # Módulo de clientes
│       ├── proveedores/          # Módulo de proveedores
│       ├── cuentasPorCobrar/     # Cuentas por cobrar
│       ├── cuentasPorPagar/      # Cuentas por pagar
│       ├── abonos/               # Abonos a cuentas por cobrar
│       ├── pagoCuentasPorPagar/  # Pagos de cuentas por pagar
│       ├── delivery/             # Módulo de deliveries
│       ├── repartidor/           # Módulo de repartidores
│       ├── sesiones/             # Sesiones de caja
│       ├── gastos/               # Gastos operativos
│       ├── pagoGastos/           # Pagos de gastos
│       ├── pagos/                # Registro centralizado de pagos
│       ├── movimientosInventario/ # Movimientos de inventario
│       ├── movimientosCompras/   # Relación movimiento ↔ compra
│       ├── movimientosVentas/    # Relación movimiento ↔ venta
│       ├── reportes/             # Reportes de utilidad y rotación
│       ├── empresa/              # Datos de la empresa
│       └── autorizaciones/       # Solicitudes de autorización
├── public/                       # Frontend build (dist de Vite)
├── keys/                         # Claves/certificados (no se versionan)
├── Dockerfile                    # Imagen Docker del backend
├── docker-compose.yml            # Orquestación: PostgreSQL + App
├── .env.template                 # Plantilla de variables de entorno
└── package.json
```

---

## 🗄️ Base de Datos

El esquema de PostgreSQL gestiona las siguientes entidades:

| Tabla | Descripción |
|---|---|
| `usuarios` | Usuarios del sistema con roles (`administrador`, `empleado`, `invitado`) |
| `sesiones` | Sesiones de caja (turno de trabajo) con monto inicial/final |
| `ventas` | Ventas registradas por sesión, con cliente opcional |
| `ventaproductos` | Detalle de productos por venta |
| `ventadelivery` | Relación venta ↔ delivery |
| `productos` | Catálogo de productos con stock, precio, código de barras |
| `categoriasproductos` | Categorías de productos |
| `compras` | Compras a proveedores |
| `comprasproductos` | Detalle de productos por compra |
| `proveedores` | Proveedores con datos de contacto |
| `clientes` | Clientes con límite de crédito |
| `cuentasporcobrar` | Créditos otorgados a clientes |
| `abonos` | Pagos parciales a cuentas por cobrar |
| `cuentasporpagar` | Deudas con proveedores por compras a crédito |
| `pagocuentasporpagar` | Pagos a cuentas por pagar |
| `gastos` | Gastos operativos |
| `pagogastos` | Pagos de gastos |
| `pagos` | Registro centralizado de pagos |
| `movimientosinventario` | Trazabilidad de cambios en stock |
| `movimientoscompras` | Relación movimiento ↔ compra |
| `movimientoventas` | Relación movimiento ↔ venta |
| `repartidores` | Repartidores de delivery |
| `deliveries` | Registros de envíos |
| `empresa` | Datos de la empresa (nombre, RUC, tasa de cambio) |
| `autorizaciones` | Solicitudes de autorización empleado → admin |

### Enum de roles

```sql
tipo_rol: administrador | empleado | invitado
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto en el que corre el servidor
PORT=3000

# Carpeta de archivos estáticos (frontend build)
PUBLIC_PATH=public

# Semilla para firma de JWT (usa una cadena larga y aleatoria en producción)
JWT_SEED=randomSeedForJWT

# Credenciales PostgreSQL
POSTGRES_USER=postgres
POSTGRES_DB=lacatracha
POSTGRES_PASSWORD=tu_password_seguro

# URL de conexión para Prisma (desarrollo local)
DATABASE_URL="postgresql://postgres:tu_password_seguro@localhost:5432/lacatracha"
```

> **En producción con Docker**, la variable `DATABASE_URL` se reemplaza por `POSTGRES_URL` (definida en `docker-compose.yml`), que apunta al servicio interno `postgres-db`.

---

## 🔧 Instalación Local

### Prerrequisitos

- Node.js ≥ 20.19
- Docker y Docker Compose (para la base de datos)
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd api

# 2. Instalar dependencias (genera el cliente Prisma automáticamente via postinstall)
npm install

# 3. Configurar variables de entorno
cp .env.template .env
# Edita .env con tus valores (DATABASE_URL, JWT_SEED, etc.)

# 4. Levantar solo la base de datos con Docker
docker-compose up postgres-db -d

# 5. Aplicar migraciones de Prisma
npx prisma migrate deploy

# 6. Iniciar en modo desarrollo (hot-reload)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## 🐳 Despliegue con Docker

El `docker-compose.yml` orquesta dos servicios: **PostgreSQL** y la **aplicación completa** (backend + frontend estático).

### Inicio rápido

```bash
# Levantar toda la aplicación (BD + App)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡borra los datos de la BD!)
docker-compose down -v
```

### Variables de entorno en Docker

El `docker-compose.yml` usa valores por defecto si no se define `.env`:

| Variable | Valor por defecto |
|---|---|
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | *(ver docker-compose.yml)* |
| `POSTGRES_DB` | `lacatracha` |
| `JWT_SEED` | *(ver docker-compose.yml)* |
| `PORT` | `3000` |

Para personalizar, crea un `.env` en la raíz del proyecto con los valores deseados:

```env
POSTGRES_USER=mi_usuario
POSTGRES_PASSWORD=mi_password_seguro
POSTGRES_DB=nombre_bd
JWT_SEED=una_cadena_muy_larga_y_aleatoria
```

### Dockerfile del Backend

El `Dockerfile` de la API usa una imagen `node:22-alpine`:

1. Copia `package*.json` y `prisma/` para aprovechar la caché de Docker.
2. Instala dependencias (`npm install` ejecuta `postinstall` que genera el cliente Prisma).
3. Copia el resto del código y compila TypeScript (`npm run build`).
4. Expone el puerto `3000` y ejecuta `npm run start`.

> Los datos de PostgreSQL se persisten en un **volumen Docker nombrado** (`postgres-data`), por lo que sobreviven reinicios de contenedores.

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `npm run dev` | Inicia con hot-reload (`ts-node-dev`) |
| `build` | `npm run build` | Genera cliente Prisma + compila TypeScript a `dist/` |
| `start` | `npm start` | Lanza el servidor compilado desde `dist/app.js` |
| `prisma:generate` | `npm run prisma:generate` | Genera el cliente Prisma manualmente |

---

## 🌐 Endpoints de la API

Todos los endpoints (excepto `/api/auth/login` y `/api/auth/register`) requieren el header:

```
Authorization: Bearer <token>
```

### 🔐 Autenticación — `/api/auth`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/api/auth/login` | Login, retorna JWT | No |
| `GET` | `/api/auth/` | Obtener todos los usuarios | Sí |
| `PUT` | `/api/auth/:id` | Actualizar usuario | Sí |
| `DELETE` | `/api/auth/:id` | Eliminar usuario | Sí |

### 🛒 Ventas — `/api/ventas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/ventas` | Listar ventas activas |
| `GET` | `/api/ventas/:id` | Obtener venta por ID |
| `GET` | `/api/ventas/anuladas` | Listar ventas anuladas |
| `POST` | `/api/ventas` | Crear venta |
| `PUT` | `/api/ventas/:id` | Actualizar venta |
| `DELETE` | `/api/ventas/:id` | Anular venta |

### 📦 Productos — `/api/productos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Listar productos activos |
| `GET` | `/api/productos/:id` | Obtener producto por ID |
| `GET` | `/api/productos/barcode/:code` | Buscar por código de barras |
| `GET` | `/api/productos/desactivados` | Listar productos inactivos |
| `POST` | `/api/productos` | Crear producto |
| `PUT` | `/api/productos/:id` | Actualizar producto |
| `DELETE` | `/api/productos/:id` | Desactivar producto |

### 📂 Categorías — `/api/categoria-productos`
`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### 👥 Clientes — `/api/clientes`
`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### 🏭 Proveedores — `/api/proveedores`
`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### 🛒 Compras — `/api/compras`
`GET /`, `GET /:id`, `GET /desactivadas`, `POST /`, `PUT /:id`, `DELETE /:id`

### 💰 Cuentas por Cobrar — `/api/cuentas-por-cobrar`
`GET /`, `GET /:id`, `GET /desactivadas`, `POST /`, `PUT /:id`, `DELETE /:id`

### 💸 Cuentas por Pagar — `/api/cuentas-por-pagar`
`GET /`, `GET /:id`, `GET /desactivadas`, `POST /`, `PUT /:id`, `DELETE /:id`

### 🧾 Abonos — `/api/abonos`
`GET /`, `GET /:id`, `GET /cuenta/:cuentaId`, `POST /`, `PUT /:id`, `DELETE /:id`

### 🚚 Deliveries — `/api/deliveries`
`GET /`, `GET /:id`, `GET /desactivados`, `POST /`, `PUT /:id`, `DELETE /:id`

### 🏍️ Repartidores — `/api/repartidores`
`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### 📊 Sesiones de Caja — `/api/sesiones`
`GET /`, `GET /:id`, `GET /active`, `POST /abrir`, `PUT /cerrar/:id`

### 💳 Gastos — `/api/gastos`
`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### 📈 Reportes — `/api/reportes`
`GET /utilidad`, `GET /rotacion`

### 📦 Movimientos de Inventario — `/api/movimientos-inventario`
`GET /`, `GET /:id`, `GET /producto/:id`, `POST /`, `DELETE /:id`

### 🏢 Empresa — `/api/empresa`
`GET /`, `PUT /:id`

### 🔑 Autorizaciones — `/api/autorizaciones`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/autorizaciones` | Crear solicitud de autorización |
| `GET` | `/api/autorizaciones/pendientes` | Listar autorizaciones pendientes |
| `GET` | `/api/autorizaciones/:id/estado` | Consultar estado de una autorización |
| `PUT` | `/api/autorizaciones/:id/aprobar` | Aprobar y generar código de 6 dígitos |
| `PUT` | `/api/autorizaciones/:id/rechazar` | Rechazar autorización |
| `POST` | `/api/autorizaciones/validar` | Validar código de autorización |

---

## ⚡ WebSocket — Autorizaciones en Tiempo Real

El servidor expone un endpoint WebSocket en la misma dirección del API:

```
ws://localhost:3000/ws/autorizaciones
```

### Mensajes del cliente al servidor

| Tipo | Payload | Efecto |
|---|---|---|
| `subscribe_admin` | — | Registra la conexión como administrador. Recibirá `NUEVA_SOLICITUD` |
| `subscribe_empleado` | `{ autorizacionid: number }` | Registra la conexión esperando resolución de esa autorización |
| `ping` | — | El servidor responde `pong` (keepalive) |

### Mensajes del servidor al cliente

| Tipo | Destinatario | Payload |
|---|---|---|
| `subscribed` | Quien se suscribió | `{ role: 'admin' \| 'empleado', ... }` |
| `NUEVA_SOLICITUD` | Admins | `{ autorizacion: { id, accion, detalle, estado, ... } }` |
| `ESTADO_ACTUALIZADO` | Empleado específico | `{ autorizacionid, estado: 'APROBADO'\|'RECHAZADO', codigo? }` |
| `pong` | Quien envió ping | — |

### Arquitectura interna

```
infrastructure/websocket/
├── ws.adapter.ts             # Thin wrapper sobre la librería `ws` (WsAdapter, WsClient)
└── autorizacion.gateway.ts   # Lógica de routing WS (AutorizacionGateway)

config/
└── ws.adapter.ts             # Re-export (igual que jwt.adapter.ts → infrastructure/auth/)
```

> **La librería `ws` nunca se importa directamente en `presentation/`**. Toda la capa de presentación importa exclusivamente desde `../../config/ws.adapter`.

---

## 🔒 Sistema de Autorización

El sistema implementa un flujo de autorización admin-empleado para acciones sensibles:

1. **Empleado** solicita autorización → `POST /api/autorizaciones` (estado: `PENDIENTE`)
   - El servidor notifica instantáneamente a todos los **admins conectados** vía WebSocket (`NUEVA_SOLICITUD`)
2. **Admin** aprueba → `PUT /api/autorizaciones/:id/aprobar` — retorna un **código de 6 dígitos** de un solo uso
   - El servidor notifica instantáneamente al **empleado** vía WebSocket (`ESTADO_ACTUALIZADO: APROBADO`)
3. Admin comparte el código verbalmente con el empleado
4. **Empleado** ingresa el código → `POST /api/autorizaciones/validar` — el código queda marcado como `USADO`
5. Si el admin rechaza → `PUT /api/autorizaciones/:id/rechazar`
   - El servidor notifica al empleado vía WebSocket (`ESTADO_ACTUALIZADO: RECHAZADO`)

### Estados posibles de una autorización

| Estado | Descripción |
|---|---|
| `PENDIENTE` | Recién creada, esperando decisión del admin |
| `APROBADO` | Aprobada, código generado y disponible |
| `RECHAZADO` | Rechazada por el admin |
| `USADO` | Código ya fue validado, no puede reutilizarse |

---

## 🛡️ Autenticación y Roles

La API usa **JWT (JSON Web Tokens)** para autenticar cada petición. El token debe enviarse en el header `Authorization: Bearer <token>`.

### Roles del sistema

| Rol | Acceso |
|---|---|
| `administrador` | Acceso total a todos los módulos y acciones |
| `empleado` | Acceso a ventas, productos, compras y deliveries. Requiere autorización del admin para acciones sensibles |
| `invitado` | Acceso solo a dashboard y POS (solo lectura) |
