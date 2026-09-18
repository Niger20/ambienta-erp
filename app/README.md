# 🛒 La Catracha — Frontend

Interfaz de usuario del sistema de punto de venta **La Catracha**. SPA construida con **React 19**, **TypeScript**, **Vite 7** y **React Router 7**, que consume la API REST del backend.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Páginas y Módulos](#-páginas-y-módulos)
- [Sistema de Roles y Rutas](#-sistema-de-roles-y-rutas)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación Local](#-instalación-local)
- [Scripts Disponibles](#-scripts-disponibles)
- [Build y Despliegue](#-build-y-despliegue)
- [Autenticación](#-autenticación)
- [Sistema de Autorización Admin](#-sistema-de-autorización-admin)
- [Comunicación con la API](#-comunicación-con-la-api)

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | ^19.2 | Framework UI |
| TypeScript | ~5.9 | Lenguaje tipado |
| Vite | ^7.3 | Build tool y dev server |
| React Router DOM | ^7.13 | Enrutamiento SPA |
| Axios | ^1.13 | Cliente HTTP (REST) |
| WebSocket nativo | Browser API | Tiempo real (autorizaciones) |
| SweetAlert2 | ^11.26 | Modales y alertas elegantes |
| XLSX | ^0.18 | Exportación a Excel |
| ESLint | ^9.39 | Análisis estático de código |

---

## ✨ Características

- **POS (Punto de Venta)** completo con búsqueda de productos por nombre y código de barras
- **Gestión de ventas** con posibilidad de anular ventas (con autorización para empleados)
- **Gestión de compras** a proveedores con soporte para crédito y contado
- **Control de inventario** con movimientos automáticos al vender/comprar
- **Cuentas por cobrar** con abonos parciales y seguimiento de saldo
- **Cuentas por pagar** con registro de cuotas y pagos
- **Gestión de deliveries** y repartidores
- **Gastos operativos** con registro de pagos por categoría
- **Sesiones de caja** con apertura/cierre y control de monto
- **Reportes** de utilidad diaria y rotación de productos con exportación a Excel
- **Sistema de autorización en tiempo real** con WebSocket nativo — empleados y admins se comunican instantáneamente sin polling
- **Control de acceso por roles** (administrador / empleado / invitado)
- **Pantalla de cliente** (`/pos/cliente`) independiente para display secundario

---

## 📁 Estructura del Proyecto

```
La-Catracha-FrontEnd/
├── public/                    # Assets estáticos (favicon, etc.)
├── src/
│   ├── main.tsx               # Entry point — monta React + AuthProvider + BrowserRouter
│   ├── App.tsx                # Componente raíz
│   ├── App.css                # Estilos del componente raíz
│   ├── index.css              # Sistema de diseño global (variables CSS, utilitarios)
│   │
│   ├── api/
│   │   └── axios.ts           # Instancia Axios configurada con interceptores JWT
│   │
│   ├── context/
│   │   └── AuthContext.tsx    # Contexto global de autenticación (usuario, token, sesión)
│   │
│   ├── hooks/
│   │   └── useAutorizacionWS.ts  # Hooks WebSocket para el flujo de autorizaciones
│   │
│   ├── router/
│   │   ├── AppRouter.tsx      # Definición de todas las rutas con control de roles
│   │   └── ProtectedRoute.tsx # HOC que redirige a /login si no hay sesión activa
│   │
│   ├── layout/
│   │   ├── MainLayout.tsx     # Layout principal: Header + Sidebar + Outlet
│   │   ├── Header.tsx         # Barra superior (sesión de caja, usuario, notif. admins)
│   │   └── Sidebar.tsx        # Menú lateral de navegación con íconos por módulo
│   │
│   └── pages/
│       ├── Login.tsx          # Página de inicio de sesión
│       ├── Dashboard.tsx      # Panel principal con resumen del negocio
│       ├── POS.tsx            # Punto de venta (carrito, productos, pagos)
│       ├── CustomerDisplay.tsx# Pantalla de display para el cliente (secundaria)
│       ├── Products.tsx       # Gestión de productos, categorías e inventario
│       ├── Sales.tsx          # Historial y gestión de ventas
│       ├── Purchases.tsx      # Gestión de compras, proveedores y cuentas por pagar
│       ├── Deliveries.tsx     # Gestión de deliveries y repartidores
│       ├── Expenses.tsx       # Gastos operativos y pagos
│       ├── Sessions.tsx       # Sesiones de caja (solo admin)
│       ├── Reportes.tsx       # Reportes de utilidad y rotación (solo admin)
│       └── Users.tsx          # Gestión de usuarios (solo admin)
├── index.html
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── Dockerfile
└── package.json
```

---

## 📄 Páginas y Módulos

### 🔑 Login (`/login`)
- Formulario de inicio de sesión con validaciones
- Al autenticarse, guarda el token JWT y datos del usuario en `localStorage`
- Redirige automáticamente al dashboard si ya hay sesión activa

### 📊 Dashboard (`/dashboard`)
- Panel de control con resumen del estado del negocio
- Accesible por todos los roles autenticados

### 🛒 POS — Punto de Venta (`/pos`)
- Búsqueda de productos por nombre o código de barras
- Carrito de compras con cantidades y descuentos por ítem
- Selección de cliente, método de pago y tipo de venta (contado / crédito / delivery)
- Pantalla de cliente separada en `/pos/cliente` (para segundo monitor)
- Accesible por todos los roles

### 📈 Ventas (`/sales`) — *Empleado + Admin*
- Listado de ventas con filtro por fecha y búsqueda
- Toggle para mostrar ventas anuladas
- Anulación de ventas con sistema de autorización (empleados requieren PIN de admin)
- Detalle de productos por venta
- Vista de cuentas por cobrar y gestión de abonos

### 📦 Productos (`/products`) — *Empleado + Admin*
- CRUD completo de productos con código de barras y categoría
- Gestión de categorías de productos
- Control de stock con historial de movimientos de inventario
- Toggle para ver productos inactivos/desactivados
- Edición y eliminación con autorización para empleados

### 🏭 Compras (`/purchases`) — *Empleado + Admin*
- Registro de compras a proveedores (contado / crédito)
- Gestión de proveedores integrada
- Cuentas por pagar con registro de pagos parciales
- Toggle para mostrar compras anuladas
- Acciones sensibles protegidas por autorización

### 🚚 Deliveries (`/deliveries`) — *Empleado + Admin*
- Gestión de repartidores
- Registro y seguimiento de deliveries
- Eliminación con autorización para empleados

### 💸 Gastos (`/expenses`) — *Solo Admin*
- Registro de gastos operativos con categoría
- Pagos de gastos con múltiples métodos de pago

### 🕐 Sesiones de Caja (`/sesiones`) — *Solo Admin*
- Historial completo de sesiones de caja
- Apertura y cierre de turno con monto inicial y final

### 📊 Reportes (`/reportes`) — *Solo Admin*
- **Reporte de utilidad diaria**: ingresos, costos, gastos y ganancia neta por rango de fechas
- **Reporte de rotación de productos**: productos más y menos vendidos en un período
- Exportación a Excel con un clic (librería XLSX)

### 👤 Usuarios (`/usuarios`) — *Solo Admin*
- CRUD de usuarios del sistema
- Asignación de roles: `administrador`, `empleado`, `invitado`

---

## 🛡️ Sistema de Roles y Rutas

```
Rol               Rutas accesibles
─────────────     ─────────────────────────────────────────────────────────
administrador  →  Todas las rutas
empleado       →  /dashboard, /pos, /pos/cliente,
                  /products, /sales, /purchases, /deliveries
invitado       →  /dashboard, /pos, /pos/cliente
```

Las rutas restringidas muestran la pantalla **"🔒 Acceso denegado"** si el rol no tiene permiso. No se hace redirección silenciosa ni se expone información de la ruta.

### ProtectedRoute
Cualquier ruta dentro de `<ProtectedRoute>` verifica que haya un token válido en `localStorage`. Si no hay sesión, redirige a `/login`.

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```env
# URL base de la API backend (sin /api al final)
VITE_API_URL=http://localhost:3000
```

> Si no se define `VITE_API_URL`, Axios usará `http://localhost:3000/api` como fallback.

> **Importante**: En Vite, las variables de entorno que deban estar disponibles en el bundle de producción deben llevar el prefijo `VITE_`.

---

## 🔧 Instalación Local

### Prerrequisitos

- Node.js ≥ 18
- npm
- El backend de la API corriendo en `http://localhost:3000`

### Pasos

```bash
# 1. Ir a la carpeta del frontend
cd La-Catracha-FrontEnd

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
echo "VITE_API_URL=http://localhost:3000" > .env

# 4. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `npm run dev` | Servidor de desarrollo con HMR (Vite) |
| `build` | `npm run build` | Compila TypeScript + genera bundle de producción en `dist/` |
| `preview` | `npm run preview` | Previsualiza el build de producción localmente |
| `lint` | `npm run lint` | Análisis estático con ESLint |

---

## 🚀 Build y Despliegue

### Opción A — Servido por el backend (Express)

El API Express puede servir el frontend como archivos estáticos desde su carpeta `public/`. Para actualizar:

```bash
# 1. Generar el build desde la carpeta del frontend
cd La-Catracha-FrontEnd
npm run build

# 2. Copiar dist/ a api/public/ (PowerShell)
Remove-Item -Recurse -Force ..\..\api\public
Copy-Item -Recurse dist ..\..\api\public

# 2. Copiar dist/ a api/public/ (Bash/Linux)
rm -rf ../../api/public && cp -r dist ../../api/public
```

El servidor Express sirve `public/` como archivos estáticos. Cualquier ruta que no sea `/api/*` devuelve `index.html` (SPA fallback para React Router).

### Opción B — Contenedor Docker independiente (Nginx)

El `Dockerfile` del frontend usa un build multi-etapa:

1. **Etapa 1** (`node:18-alpine`): Compila el proyecto Vite. Acepta `VITE_API_URL` como `ARG` en tiempo de build.
2. **Etapa 2** (`nginx:alpine`): Sirve el `dist/` generado con soporte de SPA (fallback a `index.html`).

```bash
# Construir la imagen con la URL del backend
docker build --build-arg VITE_API_URL=http://mi-api.com -t catracha-frontend .

# Correr el contenedor
docker run -p 80:80 catracha-frontend
```

> El frontend estaría disponible en `http://localhost:80`.

---

## 🔐 Autenticación

El sistema usa **JWT** almacenado en `localStorage`. El `AuthContext` gestiona el estado global de autenticación:

```tsx
const { user, token, isAuthenticated, isLoading, activeSession, login, logout, refreshSession } = useAuth();
```

### Propiedades del contexto

| Propiedad | Tipo | Descripción |
|---|---|---|
| `user` | `User \| null` | Datos del usuario logueado (`id`, `nombreusuario`, `rol`) |
| `token` | `string \| null` | Token JWT activo |
| `isAuthenticated` | `boolean` | `true` si hay token válido |
| `isLoading` | `boolean` | `true` mientras se restaura la sesión desde `localStorage` |
| `activeSession` | `ActiveSession \| null` | Sesión de caja activa (`id`, `montoinicial`) |
| `login(token, user)` | función | Guarda token y usuario, actualiza estado global |
| `logout()` | función | Limpia `localStorage` y resetea el estado |
| `refreshSession()` | función | Recarga la sesión de caja activa desde la API |

### Interceptores de Axios (`src/api/axios.ts`)

El cliente HTTP tiene dos interceptores configurados:

1. **Request**: Inyecta automáticamente `Authorization: Bearer <token>` en cada petición.
2. **Response**: Si el servidor retorna `401` en una ruta no-auth, limpia la sesión y redirige a `/login`.

---

## 🔒 Sistema de Autorización Admin

Para proteger acciones sensibles (eliminar clientes, anular ventas, ajustar inventario, etc.), los **empleados** deben solicitar autorización al administrador.

### Flujo con WebSocket (sin polling)

```
1. Empleado intenta acción sensible
        │
        ▼
2. Sistema crea una solicitud → POST /api/autorizaciones
   (estado: PENDIENTE)
        │
        ▼
3. El admin recibe instantáneamente una notificación vía WebSocket
   (hook useAdminAutorizacionWS — sin polling, sin refrescar)
        │
        ▼
4. Admin aprueba desde su modal → PUT /api/autorizaciones/:id/aprobar
   → El empleado recibe el evento WebSocket ESTADO_ACTUALIZADO instantáneamente
   (hook useEmpleadoAutorizacionWS)
        │
        ▼
5. Admin comparte verbalmente el código de 6 dígitos
        │
        ▼
6. Empleado ingresa el código en el modal
   POST /api/autorizaciones/validar
   → Si válido: acción procede ✅
   → Si inválido/expirado: acción bloqueada ❌
        │
        ▼
7. Código queda marcado como USADO (no reutilizable)
```

### Hooks de WebSocket — `src/hooks/useAutorizacionWS.ts`

#### `useAdminAutorizacionWS`
Usado en `Header.tsx` (solo para administradores):

```tsx
useAdminAutorizacionWS({
    enabled: isAdmin,              // Solo activa el WS si el usuario es admin
    onNuevaSolicitud: (auth) => {  // Callback cuando llega una nueva solicitud
        setPendingAuths(prev => [...prev, auth]);
        playBeep();
        setShowAuthModal(true);
    },
});
```

- Se reconecta automáticamente si se pierde la conexión (backoff de 3 segundos).
- No hace ningún request HTTP; el servidor empuja los eventos vía WebSocket.

#### `useEmpleadoAutorizacionWS`
Usado en `Sales.tsx`, `Products.tsx`, `Purchases.tsx`, `Deliveries.tsx` (empleados):

```tsx
useEmpleadoAutorizacionWS({
    autorizacionid: showAuthModal ? pendingAuthId : null, // null = no conectar
    onAprobado: (codigo) => { /* PIN disponible para ingresar */ },
    onRechazado: () => {
        setShowAuthModal(false);
        Swal.fire({ icon: 'error', title: 'Solicitud rechazada', ... });
    },
});
```

- Solo abre la conexión WebSocket cuando `autorizacionid` es non-null.
- Se desconecta automáticamente al recibir la resolución (aprobado o rechazado).

---

## 🌐 Comunicación con la API

Todos los módulos usan la instancia centralizada de Axios:

```typescript
import api from '../api/axios';

// Ejemplos
const response = await api.get('/ventas');
const venta = await api.post('/ventas', payload);
await api.put(`/ventas/${id}`, payload);
await api.delete(`/ventas/${id}`);
```

### Endpoints consumidos por módulo

| Módulo Frontend | Base URL API |
|---|---|
| Autenticación | `/api/auth` |
| Ventas | `/api/ventas`, `/api/venta-productos`, `/api/venta-delivery` |
| Productos | `/api/productos`, `/api/categoria-productos` |
| Compras | `/api/compras`, `/api/compras-productos` |
| Clientes | `/api/clientes` |
| Proveedores | `/api/proveedores` |
| Cuentas por Cobrar | `/api/cuentas-por-cobrar`, `/api/abonos` |
| Cuentas por Pagar | `/api/cuentas-por-pagar`, `/api/pago-cuentas-por-pagar` |
| Deliveries | `/api/deliveries`, `/api/venta-delivery` |
| Repartidores | `/api/repartidores` |
| Gastos | `/api/gastos`, `/api/pago-gastos` |
| Sesiones | `/api/sesiones` |
| Inventario | `/api/movimientos-inventario` |
| Reportes | `/api/reportes` |
| Autorizaciones | `/api/autorizaciones` |
| Empresa | `/api/empresa` |
| Usuarios | `/api/auth` |
