# 🏪 AmbientaPOS

Sistema integral de gestión de punto de venta (POS), administración de clientes, inventario, recursos humanos y nómina para negocios pequeños y medianos.

**Versión:** 1.0.0 | **Estado:** En desarrollo activo

---

## ✨ Características Principales

### 📦 Módulo POS
- **Cotizaciones** automáticas para productos agotados, sin límite de stock en la cantidad cotizada
- **Búsqueda de productos** por código de barras, ID o nombre (la barra se limpia al agregar el producto)
- **Ventas normales, crédito y mixto** con múltiples métodos de pago
- **Facturación fiscal y comercial** con tipos de consecutivos
- **Delivery integrado** con control de repartidores
- **Reportes en tiempo real** con exportación a Excel
- **Autosincronización de estado** entre terminales

### 👥 Gestión de Clientes
- Registro completo de clientes con límite de crédito
- Historial de compras y transacciones
- Seguimiento de cuentas por cobrar
- Abonos parciales a créditos

### 📊 Control de Inventario
- Stock en tiempo real
- Ajustes manuales de inventario
- Seguimiento de devoluciones
- Revaluación de inventario

### 💼 Recursos Humanos & Nómina
- Gestión de empleados y puestos
- Cálculo de nómina automático
- Provisiones (décimo tercer mes, indemnización)
- Reportes de planilla

### 🔐 Seguridad
- Autenticación JWT
- Control de sesiones
- Rate limiting en endpoints críticos
- Encriptación de contraseñas con bcrypt

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router v7** - Routing
- **Axios** - HTTP client
- **SweetAlert2** - Modals
- **jsPDF + jsBarcode** - Generación de reportes y códigos
- **XLSX** - Exportación Excel

### Backend
- **Node.js 20+** - Runtime
- **Express 5** - Framework HTTP
- **TypeScript** - Type safety
- **Prisma 7** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **WebSockets** - Comunicación en tiempo real
- **Helmet** - Seguridad HTTP
- **express-rate-limit** - Limitación de peticiones

### Infraestructura
- **Docker** - Containerización (API y Frontend)
- **docker-compose** - Orquestación local
- **PostgreSQL 15** - Base de datos relacional

---

## 📋 Requisitos Previos

- **Node.js** >= 20.19
- **npm** >= 9.0
- **Docker** & **Docker Compose** (para desarrollo local)
- **Git** para clonar el repositorio

---

## 🚀 Instalación & Setup Local

### 1. Clonar repositorio
```bash
git clone https://github.com/Niger20/AmbientaPOS.git
cd AmbientaPOS
```

### 2. Configurar variables de entorno

**API (`api/.env`)**
```env
PORT=3000
PUBLIC_PATH=public
JWT_SEED=tu_semilla_jwt_segura_aqui
POSTGRES_URL=postgresql://usuario:contraseña@localhost:5432/AmbientaBD
NODE_ENV=development

# URL del frontend (se usa en el link de verificación de correo)
APP_BASE_URL=http://localhost:5173

# Correo de verificación — prioridad: Resend > SMTP > consola
RESEND_API_KEY=
RESEND_FROM=Ambienta ERP <onboarding@resend.dev>
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Ambienta ERP <no-reply@ambienta.local>

# Orígenes CORS adicionales, separados por coma (localhost siempre está permitido)
ALLOWED_ORIGINS=https://tu-dominio-de-produccion.up.railway.app
```

Ver `api/.env.template` para la referencia completa con comentarios.

#### 📧 Envío de correos
El correo de verificación de cuenta se envía con el primer método configurado:
1. **Resend** (recomendado en producción): API HTTP, funciona aunque el hosting bloquee el puerto SMTP (como Railway). Requiere `RESEND_API_KEY`; crea una cuenta gratis en [resend.com](https://resend.com).
2. **SMTP** (Nodemailer): alternativa, p. ej. Gmail con una *contraseña de aplicación*. Tiene timeouts de 8 s para no colgar las peticiones si el servidor no responde.
3. **Consola**: si no hay Resend ni SMTP, el link de verificación se imprime en la consola del backend (modo desarrollo).

Si el envío falla durante el registro, **la cuenta se crea igual**: el error queda en el log y el usuario puede pedir que se reenvíe el correo.

#### 🌐 CORS
Los orígenes `localhost` están permitidos siempre. Los dominios de producción **no van en el código**: se agregan en `ALLOWED_ORIGINS` (separados por coma), en el `.env` o en el dashboard del hosting.

**Frontend (variables dentro de `app/src`)**
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Iniciar stack local con Docker

```bash
cd api
docker-compose up -d
```

Esto levanta:
- PostgreSQL en `localhost:5432`
- API en `http://localhost:3000`
- Frontend en `http://localhost:5173` (Vite dev server)

### 4. Setup API

```bash
cd api
npm install
npm run dev
```

La API estará disponible en `http://localhost:3000`

### 5. Setup Frontend

```bash
cd app
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 6. Crear base de datos
```bash
cd api
npx prisma migrate dev
```

---

## 📁 Estructura del Proyecto

```
AmbientaPOS/
├── api/                              # Backend Express + TypeScript
│   ├── src/
│   │   ├── app.ts                   # Entrada principal
│   │   ├── presentation/            # Controladores y rutas
│   │   ├── infrastructure/          # Servicios, adapters, datasources
│   │   ├── domain/                  # Entities, DTOs, interfaces
│   │   ├── data/                    # Conexión Prisma
│   │   └── config/                  # Configuración (CORS, JWT, Rate Limit, etc.)
│   ├── prisma/
│   │   └── schema.prisma            # Esquema de base de datos
│   ├── Dockerfile                   # Imagen Docker API
│   ├── docker-compose.yml           # Stack local (PostgreSQL + API)
│   └── package.json
│
├── app/                              # Frontend React + Vite
│   ├── src/
│   │   ├── pages/                   # Componentes de página (POS, Ventas, etc.)
│   │   ├── components/              # Componentes reutilizables
│   │   ├── styles/                  # CSS global
│   │   ├── App.tsx                  # Componente raíz
│   │   └── main.tsx                 # Entrada principal
│   ├── Dockerfile                   # Imagen Docker Frontend (Nginx)
│   ├── vite.config.ts               # Configuración Vite
│   └── package.json
│
├── Database/                         # Dumps y scripts SQL
│   ├── AmbientaBD_Neon_Completo.sql # Backup completo de BD
│   └── MODULO_PLANILLA.sql          # Schema de planilla
│
└── README.md                         # Este archivo
```

---

## 🎯 Scripts Disponibles

### Frontend (`app/`)
```bash
npm run dev          # Iniciar servidor Vite en desarrollo
npm run build        # Build para producción
npm run lint         # Verificar código con ESLint
npm run preview      # Vista previa de build
```

### Backend (`api/`)
```bash
npm run dev          # Iniciar servidor con ts-node-dev (hot reload)
npm run build        # Compilar TypeScript
npm start            # Iniciar desde dist/ (producción)
npm run prisma:generate  # Regenerar cliente Prisma
```

---

## 🔑 Endpoint Principales de la API

Todos los endpoints están bajo `/api`:

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| **POS** | `POST /ventas` | Registrar venta |
| | `GET /ventas` | Listar ventas |
| | `POST /venta-productos` | Agregar producto a venta |
| **Clientes** | `GET /clientes` | Listar clientes |
| | `POST /clientes` | Crear cliente |
| **Inventario** | `GET /productos` | Listar productos |
| | `PUT /productos/:id` | Actualizar producto |
| **Nómina** | `GET /empleados` | Listar empleados |
| | `POST /planilla` | Generar nómina |
| **Autenticación** | `POST /auth/login` | Login |
| | `POST /auth/logout` | Logout |

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)**:

1. Usuario hace login con credenciales
2. API devuelve token JWT en la respuesta
3. Cliente guarda token en sessionStorage/localStorage
4. Token se envía en header `Authorization: Bearer <token>` en peticiones autenticadas

**Endpoints públicos:**
- `POST /auth/login`

**Endpoints protegidos:** Requieren JWT válido

---

## 🚢 Deployment

### Production-Ready Features
- ✅ Docker images optimizadas
- ✅ SSL/TLS ready
- ✅ Rate limiting habilitado
- ✅ CORS configurado
- ✅ Security headers (Helmet)
- ✅ Trust proxy para load balancers

### Plataformas recomendadas
- **Backend:** Railway, Render, Heroku
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **DB:** Railway Postgres, Neon, AWS RDS

### Ejemplo con Railway
```bash
# Variables de entorno necesarias:
POSTGRES_URL=postgresql://...
JWT_SEED=tu_seed_segura
NODE_ENV=production
APP_BASE_URL=https://tu-frontend.up.railway.app
ALLOWED_ORIGINS=https://tu-frontend.up.railway.app
RESEND_API_KEY=re_...          # Railway bloquea SMTP saliente: usar Resend
RESEND_FROM=Ambienta ERP <no-reply@tu-dominio.com>
```

---

## 🐛 Troubleshooting

### La app en producción sigue mostrando código antiguo
**Solución:** Limpiar cache del navegador (Ctrl+Shift+Delete) o hacer hard refresh (Ctrl+Shift+R)

### Error: `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`
**Solución:** Configurar `trust proxy` en Express (ya incluido en código)

### Error de CORS en producción (`blocked by CORS policy`)
**Solución:** Agregar la URL pública del frontend a `ALLOWED_ORIGINS` en las variables de entorno del backend y reiniciar el servicio.

### No llega el correo de verificación
**Solución:** Revisar los logs del backend. En Railway el puerto SMTP está bloqueado: configurar `RESEND_API_KEY`. Sin Resend ni SMTP configurados, el link aparece en la consola del backend.

### Error: `ventas_tipoventa_check` al cotizar con delivery
**Solución:** Verificar que el constraint de `ventas` tabla permita `COTIZACION` en la BD:
```sql
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_tipoventa_check;
ALTER TABLE ventas ADD CONSTRAINT ventas_tipoventa_check 
  CHECK (tipoventa IN ('CREDITO', 'CONTADO', 'COTIZACION'));
```

---

## 📝 Notas Importantes

### Cotizaciones
- Productos con **stock 0** se agregan como cotización automáticamente
- En modo cotización (o con productos agotados) la cantidad **no está limitada por el stock actual**: se pueden cotizar, por ejemplo, 5 unidades de un producto con stock 0
- En ventas de contado, crédito o mixto la cantidad sí se limita al stock disponible
- No se descuenta stock hasta que se convierta la cotización a venta formal

### Modales y alertas
- Los modales usan `.modal-backdrop` con `z-index: 9999`
- Los modales anidados (p. ej. **Crear Nueva Categoría** desde el modal de producto) usan `zIndex: 10000` para abrirse encima
- Las alertas de SweetAlert2 (errores, confirmaciones) usan `z-index: 100000` (`app/src/styles/sweetalert.css`) para mostrarse siempre sobre cualquier modal

### Facturación
- **Sin Consecutivo**: Factura comercial simple (por defecto en POS)
- **Fiscal**: Consecutivo oficial (Serie F)
- **Comercial**: Consecutivo interno (Serie S)

### Stock
- Solo se descuenta al confirmar una venta formal (no cotización)
- Devoluciones incrementan stock automáticamente

---

## 🤝 Contribuciones

Para contribuir:
1. Crear una rama feature: `git checkout -b feature/mi-feature`
2. Hacer commits descriptivos: `git commit -m "Add: descripción clara"`
3. Push a la rama: `git push origin feature/mi-feature`
4. Abrir un Pull Request

---

## 📄 Licencia

ISC License - Ver `LICENSE` para más detalles

---

## 👨‍💻 Autor

**Niger20** - [GitHub](https://github.com/Niger20)

---

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio:
[GitHub Issues](https://github.com/Niger20/AmbientaPOS/issues)

---

**Última actualización:** Septiembre 2026
