-- CreateTable
CREATE TABLE "abonos" (
    "abonoid" SERIAL NOT NULL,
    "cuentaid" INTEGER NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodopago" VARCHAR(50) NOT NULL,

    CONSTRAINT "abonos_pkey" PRIMARY KEY ("abonoid")
);

-- CreateTable
CREATE TABLE "categoriasproductos" (
    "categoriaid" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categoriasproductos_pkey" PRIMARY KEY ("categoriaid")
);

-- CreateTable
CREATE TABLE "clientes" (
    "clienteid" SERIAL NOT NULL,
    "categoriaclienteid" INTEGER,
    "nombre" VARCHAR(100) NOT NULL,
    "tipocliente" VARCHAR(20) NOT NULL DEFAULT 'NATURAL',
    "cedula" VARCHAR(20),
    "ruc" VARCHAR(20),
    "telefono" VARCHAR(15),
    "direccion" TEXT,
    "ubicaciongeografica" VARCHAR(255),
    "limitecredito" DECIMAL(10,2),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("clienteid")
);

-- CreateTable
CREATE TABLE "compras" (
    "compraid" SERIAL NOT NULL,
    "proveedorid" INTEGER NOT NULL,
    "ordencompraid" INTEGER,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "metodopago" VARCHAR(50) NOT NULL,
    "tipocompra" VARCHAR(50) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "facturaproveedor" VARCHAR(100),

    CONSTRAINT "compras_pkey" PRIMARY KEY ("compraid")
);

-- CreateTable
CREATE TABLE "comprasproductos" (
    "compraid" INTEGER NOT NULL,
    "productoid" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "preciounitario" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) DEFAULT 0,
    "totalproducto" DECIMAL(10,2) GENERATED ALWAYS AS ((preciounitario * cantidad) - descuento) STORED,
    "numerolote" VARCHAR(50),

    CONSTRAINT "comprasproductos_pkey" PRIMARY KEY ("compraid","productoid")
);

-- CreateTable
CREATE TABLE "cuentasporcobrar" (
    "cuentaid" SERIAL NOT NULL,
    "ventaid" INTEGER NOT NULL,
    "clienteid" INTEGER NOT NULL,
    "montototal" DECIMAL(10,2) NOT NULL,
    "montopagado" DECIMAL(10,2) DEFAULT 0,
    "montorestante" DECIMAL(10,2) GENERATED ALWAYS AS (montototal - montopagado) STORED,
    "fechavencimiento" DATE NOT NULL,
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "cuentasporcobrar_pkey" PRIMARY KEY ("cuentaid")
);

-- CreateTable
CREATE TABLE "cuentasporpagar" (
    "cuentapagarid" SERIAL NOT NULL,
    "compraid" INTEGER NOT NULL,
    "montototal" DECIMAL(10,2) NOT NULL,
    "montopagado" DECIMAL(10,2) DEFAULT 0,
    "montorestante" DECIMAL(10,2) GENERATED ALWAYS AS (montototal - montopagado) STORED,
    "cuotas" INTEGER,
    "montocuota" DECIMAL(10,2),
    "fechacuota" INTEGER,
    "fechavencimiento" DATE NOT NULL,
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "cuentasporpagar_pkey" PRIMARY KEY ("cuentapagarid")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "deliveryid" SERIAL NOT NULL,
    "repartidorid" INTEGER NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "direccionentrega" TEXT NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("deliveryid")
);

-- CreateTable
CREATE TABLE "empresa" (
    "empresaid" SERIAL NOT NULL,
    "nombreempresa" VARCHAR(100),
    "direccion" TEXT,
    "telefono" VARCHAR(15),
    "ruc" VARCHAR(50),
    "logourl" VARCHAR(255),
    "tasacambio" DECIMAL(10,2),

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("empresaid")
);

-- CreateTable
CREATE TABLE "gastos" (
    "gastoid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("gastoid")
);

-- CreateTable
CREATE TABLE "movimientoscompras" (
    "movimientocompraid" INTEGER NOT NULL,
    "compraid" INTEGER NOT NULL,

    CONSTRAINT "movimientoscompras_pkey" PRIMARY KEY ("movimientocompraid","compraid")
);

-- CreateTable
CREATE TABLE "movimientosinventario" (
    "movimientoid" SERIAL NOT NULL,
    "productoid" INTEGER NOT NULL,
    "tipomovimiento" VARCHAR(50) NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "numerolote" VARCHAR(50),
    "stockanterior" DECIMAL(10,2) NOT NULL,
    "stockresultante" DECIMAL(10,2) GENERATED ALWAYS AS (stockanterior + cantidad) STORED,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,

    CONSTRAINT "movimientosinventario_pkey" PRIMARY KEY ("movimientoid")
);

-- CreateTable
CREATE TABLE "movimientoventas" (
    "movimeintoventaid" INTEGER NOT NULL,
    "ventaid" INTEGER NOT NULL,

    CONSTRAINT "movimientoventas_pkey" PRIMARY KEY ("movimeintoventaid","ventaid")
);

-- CreateTable
CREATE TABLE "pagocuentasporpagar" (
    "pagoid" INTEGER NOT NULL,
    "cuentapagarid" INTEGER NOT NULL,

    CONSTRAINT "pagocuentasporpagar_pkey" PRIMARY KEY ("pagoid","cuentapagarid")
);

-- CreateTable
CREATE TABLE "pagogastos" (
    "pagoid" INTEGER NOT NULL,
    "gastoid" INTEGER NOT NULL,

    CONSTRAINT "pagogastos_pkey" PRIMARY KEY ("pagoid","gastoid")
);

-- CreateTable
CREATE TABLE "pagos" (
    "pagoid" SERIAL NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodopago" VARCHAR(50) NOT NULL DEFAULT 'Efectivo',
    "estado" BOOLEAN DEFAULT false,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("pagoid")
);

-- CreateTable
CREATE TABLE "productos" (
    "productoid" SERIAL NOT NULL,
    "codigobarra" VARCHAR(50),
    "categoriaid" INTEGER,
    "unidadmedidaid" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "preciocompra" DECIMAL(10,2) NOT NULL,
    "precioventa" DECIMAL(10,2) NOT NULL,
    "utilidad" DECIMAL(10,2) GENERATED ALWAYS AS (precioventa - preciocompra) STORED,
    "preciomayoreo" DECIMAL(10,2),
    "cantidadminimamayoreo" DECIMAL(10,2),
    "stockminimo" DECIMAL(10,2) DEFAULT 0,
    "stockactual" DECIMAL(10,2) DEFAULT 0,
    "requierefechavencimiento" BOOLEAN NOT NULL DEFAULT false,
    "fechavencimiento" DATE,
    "publicadoencatalogo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("productoid")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "proveedorid" SERIAL NOT NULL,
    "nombreempresa" VARCHAR(100) NOT NULL,
    "asesorventas" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15),
    "direccion" TEXT,
    "ubicaciongeografica" VARCHAR(255),
    "clasificacion" VARCHAR(50),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("proveedorid")
);

-- CreateTable
CREATE TABLE "repartidores" (
    "repartidorid" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15),

    CONSTRAINT "repartidores_pkey" PRIMARY KEY ("repartidorid")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "sesionid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "fechainicio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fechafin" TIMESTAMP(6),
    "montoinicial" DECIMAL(10,2) NOT NULL,
    "montofinalsistema" DECIMAL(10,2),
    "montofinalfisico" DECIMAL(10,2),

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("sesionid")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "usuarioid" SERIAL NOT NULL,
    "nombreusuario" VARCHAR(50) NOT NULL,
    "contrasenahash" VARCHAR(255) NOT NULL,
    "fecharegistro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "rol" VARCHAR(50),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuarioid")
);

-- CreateTable
CREATE TABLE "ventadelivery" (
    "ventaid" INTEGER NOT NULL,
    "deliveryid" INTEGER NOT NULL,

    CONSTRAINT "ventadelivery_pkey" PRIMARY KEY ("ventaid","deliveryid")
);

-- CreateTable
CREATE TABLE "ventaproductos" (
    "ventaid" INTEGER NOT NULL,
    "productoid" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "preciounitario" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) DEFAULT 0,
    "totalproducto" DECIMAL(10,2) GENERATED ALWAYS AS ((preciounitario * cantidad) - descuento) STORED,

    CONSTRAINT "ventaproductos_pkey" PRIMARY KEY ("ventaid","productoid")
);

-- CreateTable
CREATE TABLE "ventas" (
    "ventaid" SERIAL NOT NULL,
    "clienteid" INTEGER,
    "sesionid" INTEGER NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "descuentofactura" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tipoventa" VARCHAR(50) NOT NULL,
    "lugarventa" VARCHAR(50) NOT NULL,
    "tipofactura" VARCHAR(20),
    "consecutivofiscal" VARCHAR(20),
    "consecutivonofiscal" VARCHAR(20),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("ventaid")
);

-- CreateTable
CREATE TABLE "acumuladodecimoprimermes" (
    "acumuladodecimoid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "periodoid" INTEGER NOT NULL,
    "salariobruto" DECIMAL(10,2) NOT NULL,
    "montoacumulado" DECIMAL(10,2) NOT NULL,
    "montopagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fechageneracion" DATE NOT NULL,

    CONSTRAINT "acumuladodecimoprimermes_pkey" PRIMARY KEY ("acumuladodecimoid")
);

-- CreateTable
CREATE TABLE "acumuladoindemnizacion" (
    "acumuladoindemnid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "periodoid" INTEGER NOT NULL,
    "salariobruto" DECIMAL(10,2) NOT NULL,
    "montoacumulado" DECIMAL(10,2) NOT NULL,
    "fechageneracion" DATE NOT NULL,

    CONSTRAINT "acumuladoindemnizacion_pkey" PRIMARY KEY ("acumuladoindemnid")
);

-- CreateTable
CREATE TABLE "acumuladovacaciones" (
    "acumuladovacid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "periodoid" INTEGER NOT NULL,
    "diasganados" DECIMAL(6,2) NOT NULL DEFAULT 2.50,
    "valordiasalario" DECIMAL(10,2) NOT NULL,
    "montoganado" DECIMAL(10,2) GENERATED ALWAYS AS (diasganados * valordiasalario) STORED,
    "diasdisfrutados" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "montopagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fechageneracion" DATE NOT NULL,

    CONSTRAINT "acumuladovacaciones_pkey" PRIMARY KEY ("acumuladovacid")
);

-- CreateTable
CREATE TABLE "anticipossalario" (
    "anticipoid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaanticipoid" DATE NOT NULL,
    "descontadoenperiodoid" INTEGER,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "usuarioid" INTEGER,

    CONSTRAINT "anticipossalario_pkey" PRIMARY KEY ("anticipoid")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "auditoriaid" SERIAL NOT NULL,
    "usuarioid" INTEGER,
    "tabla" VARCHAR(100) NOT NULL,
    "operacion" VARCHAR(10) NOT NULL,
    "datosanteriores" JSONB,
    "datosnuevos" JSONB,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("auditoriaid")
);

-- CreateTable
CREATE TABLE "cargosempleados" (
    "cargoid" SERIAL NOT NULL,
    "departamentoid" INTEGER,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "salariominimoreferencial" DECIMAL(10,2),
    "salariomaximoreferencial" DECIMAL(10,2),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cargosempleados_pkey" PRIMARY KEY ("cargoid")
);

-- CreateTable
CREATE TABLE "categoriasclientes" (
    "categoriaclienteid" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "porcentajedescuento" DECIMAL(5,2) DEFAULT 0,

    CONSTRAINT "categoriasclientes_pkey" PRIMARY KEY ("categoriaclienteid")
);

-- CreateTable
CREATE TABLE "configuracioninss" (
    "configinssid" SERIAL NOT NULL,
    "tasalaboral" DECIMAL(5,4) NOT NULL,
    "tasapatronal" DECIMAL(5,4) NOT NULL,
    "fechavigencia" DATE NOT NULL,
    "fechafinvigencia" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "configuracioninss_pkey" PRIMARY KEY ("configinssid")
);

-- CreateTable
CREATE TABLE "costosadicionalescompras" (
    "costoadicionalid" SERIAL NOT NULL,
    "compraid" INTEGER NOT NULL,
    "concepto" VARCHAR(100) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "costosadicionalescompras_pkey" PRIMARY KEY ("costoadicionalid")
);

-- CreateTable
CREATE TABLE "cuotasprestamos" (
    "cuotaid" SERIAL NOT NULL,
    "prestamoid" INTEGER NOT NULL,
    "numerocuota" INTEGER NOT NULL,
    "montocuota" DECIMAL(10,2) NOT NULL,
    "fechavencimiento" DATE NOT NULL,
    "fechapago" DATE,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "detalleid" INTEGER,

    CONSTRAINT "cuotasprestamos_pkey" PRIMARY KEY ("cuotaid")
);

-- CreateTable
CREATE TABLE "departamentosempleados" (
    "departamentoid" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "jefeempleadoid" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "departamentosempleados_pkey" PRIMARY KEY ("departamentoid")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "devolucionid" SERIAL NOT NULL,
    "ventaid" INTEGER NOT NULL,
    "productoid" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "montodevuelto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "usuarioid" INTEGER NOT NULL,

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("devolucionid")
);

-- CreateTable
CREATE TABLE "empleados" (
    "empleadoid" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "cedula" VARCHAR(20) NOT NULL,
    "fechanacimiento" DATE,
    "sexo" CHAR(1),
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "direcciondomicilio" TEXT,
    "departamentoid" INTEGER,
    "cargoid" INTEGER,
    "cargo" VARCHAR(100) NOT NULL,
    "tipocontrato" VARCHAR(30) NOT NULL,
    "tipojornada" VARCHAR(10) NOT NULL DEFAULT 'DIURNA',
    "horasdiariasjornada" DECIMAL(4,2) NOT NULL DEFAULT 8.00,
    "salariobase" DECIMAL(10,2) NOT NULL,
    "tipopago" VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    "numeroinss" VARCHAR(20),
    "banco" VARCHAR(100),
    "cuentabancaria" VARCHAR(50),
    "tipocuenta" VARCHAR(20),
    "fechaingreso" DATE NOT NULL,
    "fechasalida" DATE,
    "motivosalida" VARCHAR(100),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("empleadoid")
);

-- CreateTable
CREATE TABLE "feriadosnacionales" (
    "feriadoid" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "esrecurrente" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "feriadosnacionales_pkey" PRIMARY KEY ("feriadoid")
);

-- CreateTable
CREATE TABLE "historialsalarios" (
    "historialid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "salarioanterior" DECIMAL(10,2) NOT NULL,
    "salarionuevo" DECIMAL(10,2) NOT NULL,
    "fechacambio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "usuarioid" INTEGER,

    CONSTRAINT "historialsalarios_pkey" PRIMARY KEY ("historialid")
);

-- CreateTable
CREATE TABLE "imagenesproductos" (
    "imagenid" SERIAL NOT NULL,
    "productoid" INTEGER NOT NULL,
    "urlimagen" VARCHAR(255) NOT NULL,
    "esprincipal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "imagenesproductos_pkey" PRIMARY KEY ("imagenid")
);

-- CreateTable
CREATE TABLE "liquidacionesempleados" (
    "liquidacionid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "fechaliquidacion" DATE NOT NULL,
    "tiposalida" VARCHAR(30) NOT NULL,
    "salariobrutobase" DECIMAL(10,2) NOT NULL,
    "diaslaborados" INTEGER NOT NULL,
    "vacacionespagadas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "decimotercerpagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "indemnizacionpagada" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "salariosatrasados" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otrosbeneficios" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "prestamosdescontados" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "anticiposdescontados" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otrasdeduccionesliq" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalbruto" DECIMAL(10,2) GENERATED ALWAYS AS ((((vacacionespagadas + decimotercerpagado) + indemnizacionpagada) + salariosatrasados) + otrosbeneficios) STORED,
    "totaldescuentos" DECIMAL(10,2) GENERATED ALWAYS AS ((prestamosdescontados + anticiposdescontados) + otrasdeduccionesliq) STORED,
    "montoneto" DECIMAL(10,2) GENERATED ALWAYS AS (((((vacacionespagadas + decimotercerpagado) + indemnizacionpagada) + salariosatrasados) + otrosbeneficios) - ((prestamosdescontados + anticiposdescontados) + otrasdeduccionesliq)) STORED,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
    "usuarioid" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "liquidacionesempleados_pkey" PRIMARY KEY ("liquidacionid")
);

-- CreateTable
CREATE TABLE "mermas" (
    "mermaid" SERIAL NOT NULL,
    "productoid" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "costounitario" DECIMAL(10,2) NOT NULL,
    "costoperdida" DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * costounitario) STORED,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "usuarioid" INTEGER NOT NULL,
    "movimientoid" INTEGER,
    "productodestinoid" INTEGER,
    "cantidaddestino" DECIMAL(10,2),
    "movimientoingresoid" INTEGER,

    CONSTRAINT "mermas_pkey" PRIMARY KEY ("mermaid")
);

-- CreateTable
CREATE TABLE "ordenescompra" (
    "ordencompraid" SERIAL NOT NULL,
    "proveedorid" INTEGER NOT NULL,
    "fechaorden" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fechaesperada" DATE,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "ordenescompra_pkey" PRIMARY KEY ("ordencompraid")
);

-- CreateTable
CREATE TABLE "ordenescompraproductos" (
    "ordencompraid" INTEGER NOT NULL,
    "productoid" INTEGER NOT NULL,
    "cantidadordenada" DECIMAL(10,2) NOT NULL,
    "preciounitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ordenescompraproductos_pkey" PRIMARY KEY ("ordencompraid","productoid")
);

-- CreateTable
CREATE TABLE "pagosbeneficios" (
    "pagobeneficioid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "tipobeneficio" VARCHAR(30) NOT NULL,
    "montopagado" DECIMAL(10,2) NOT NULL,
    "fechapago" DATE NOT NULL,
    "periodoid" INTEGER,
    "observaciones" TEXT,
    "usuarioid" INTEGER,

    CONSTRAINT "pagosbeneficios_pkey" PRIMARY KEY ("pagobeneficioid")
);

-- CreateTable
CREATE TABLE "periodosplanilla" (
    "periodoid" SERIAL NOT NULL,
    "tipoperiodo" VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    "fechainicio" DATE NOT NULL,
    "fechafin" DATE NOT NULL,
    "fechapago" DATE,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ABIERTO',
    "observaciones" TEXT,
    "usuarioaprobacionid" INTEGER,
    "fechaaprobacion" TIMESTAMP(6),

    CONSTRAINT "periodosplanilla_pkey" PRIMARY KEY ("periodoid")
);

-- CreateTable
CREATE TABLE "planilladeducciones" (
    "deduccionplanillaid" SERIAL NOT NULL,
    "detalleid" INTEGER NOT NULL,
    "concepto" VARCHAR(100) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "planilladeducciones_pkey" PRIMARY KEY ("deduccionplanillaid")
);

-- CreateTable
CREATE TABLE "planilladetalle" (
    "detalleid" SERIAL NOT NULL,
    "periodoid" INTEGER NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "salariobruto" DECIMAL(10,2) NOT NULL,
    "montohorasextra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "comisiones" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pagoferiados" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otrosingresos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalingresos" DECIMAL(10,2) GENERATED ALWAYS AS ((((salariobruto + montohorasextra) + comisiones) + pagoferiados) + otrosingresos) STORED,
    "insslaboral" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ir" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otrasdeducciones" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cuotasprestamos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "anticipos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totaldeducciones" DECIMAL(10,2) GENERATED ALWAYS AS ((((insslaboral + ir) + otrasdeducciones) + cuotasprestamos) + anticipos) STORED,
    "salarioneto" DECIMAL(10,2) GENERATED ALWAYS AS (((((salariobruto + montohorasextra) + comisiones) + pagoferiados) + otrosingresos) - ((((insslaboral + ir) + otrasdeducciones) + cuotasprestamos) + anticipos)) STORED,
    "insspatronal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
    "observaciones" TEXT,

    CONSTRAINT "planilladetalle_pkey" PRIMARY KEY ("detalleid")
);

-- CreateTable
CREATE TABLE "planillahorasextra" (
    "horasextraid" SERIAL NOT NULL,
    "detalleid" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "tipohora" VARCHAR(20) NOT NULL,
    "horastrabajadas" DECIMAL(4,2) NOT NULL,
    "tarifahora" DECIMAL(10,2) NOT NULL,
    "porcentajerecargo" DECIMAL(5,2) NOT NULL,
    "montohoraextra" DECIMAL(10,2) GENERATED ALWAYS AS ((horastrabajadas * tarifahora) * (porcentajerecargo / 100.0)) STORED,

    CONSTRAINT "planillahorasextra_pkey" PRIMARY KEY ("horasextraid")
);

-- CreateTable
CREATE TABLE "prestamosempleados" (
    "prestamoid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "montopagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "montorestante" DECIMAL(10,2) GENERATED ALWAYS AS (monto - montopagado) STORED,
    "numerocuotas" INTEGER NOT NULL,
    "montocuota" DECIMAL(10,2) NOT NULL,
    "fechadesembolso" DATE NOT NULL,
    "motivo" TEXT,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "usuarioid" INTEGER,

    CONSTRAINT "prestamosempleados_pkey" PRIMARY KEY ("prestamoid")
);

-- CreateTable
CREATE TABLE "registroasistencia" (
    "asistenciaid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "horaentrada" TIME(6),
    "horasalida" TIME(6),
    "horastrabajadas" DECIMAL(5,2),
    "horasextra" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tipoausencia" VARCHAR(20),
    "observaciones" TEXT,

    CONSTRAINT "registroasistencia_pkey" PRIMARY KEY ("asistenciaid")
);

-- CreateTable
CREATE TABLE "solicitudesvacaciones" (
    "solicitudvacid" SERIAL NOT NULL,
    "empleadoid" INTEGER NOT NULL,
    "fechainicio" DATE NOT NULL,
    "fechafin" DATE NOT NULL,
    "diashabiles" DECIMAL(6,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "usuarioaprobacionid" INTEGER,
    "fechaaprobacion" TIMESTAMP(6),
    "observaciones" TEXT,

    CONSTRAINT "solicitudesvacaciones_pkey" PRIMARY KEY ("solicitudvacid")
);

-- CreateTable
CREATE TABLE "tablatramoir" (
    "tramoirid" SERIAL NOT NULL,
    "salariodesde" DECIMAL(12,2) NOT NULL,
    "salariohasta" DECIMAL(12,2),
    "cuotafija" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tasamarginal" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "fechavigencia" DATE NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tablatramoir_pkey" PRIMARY KEY ("tramoirid")
);

-- CreateTable
CREATE TABLE "unidadesmedida" (
    "unidadmedidaid" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,
    "permitefraccionamiento" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "unidadesmedida_pkey" PRIMARY KEY ("unidadmedidaid")
);

-- CreateTable
CREATE TABLE "ventapagos" (
    "ventapagoid" SERIAL NOT NULL,
    "ventaid" INTEGER NOT NULL,
    "metodopago" VARCHAR(20) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "banco" VARCHAR(100),
    "numerotransferencia" VARCHAR(50),

    CONSTRAINT "ventapagos_pkey" PRIMARY KEY ("ventapagoid")
);

-- CreateTable
CREATE TABLE "autorizaciones" (
    "autorizacionid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "accion" VARCHAR(100) NOT NULL,
    "detalle" VARCHAR(255),
    "codigo" VARCHAR(10),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_autorizaciones" PRIMARY KEY ("autorizacionid","usuarioid")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cedula_key" ON "clientes"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_ruc_key" ON "clientes"("ruc");

-- CreateIndex
CREATE INDEX "idx_compras_fecha" ON "compras"("fecha");

-- CreateIndex
CREATE INDEX "idx_movinventario_producto" ON "movimientosinventario"("productoid");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigobarra_key" ON "productos"("codigobarra");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nombreusuario_key" ON "usuarios"("nombreusuario");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_consecutivofiscal_key" ON "ventas"("consecutivofiscal");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_consecutivonofiscal_key" ON "ventas"("consecutivonofiscal");

-- CreateIndex
CREATE INDEX "idx_ventas_fecha" ON "ventas"("fecha");

-- CreateIndex
CREATE INDEX "idx_acum_decimo_empleado" ON "acumuladodecimoprimermes"("empleadoid");

-- CreateIndex
CREATE UNIQUE INDEX "acumuladodecimoprimermes_empleadoid_periodoid_key" ON "acumuladodecimoprimermes"("empleadoid", "periodoid");

-- CreateIndex
CREATE INDEX "idx_acum_indemn_empleado" ON "acumuladoindemnizacion"("empleadoid");

-- CreateIndex
CREATE UNIQUE INDEX "acumuladoindemnizacion_empleadoid_periodoid_key" ON "acumuladoindemnizacion"("empleadoid", "periodoid");

-- CreateIndex
CREATE INDEX "idx_acum_vacaciones_empleado" ON "acumuladovacaciones"("empleadoid");

-- CreateIndex
CREATE UNIQUE INDEX "acumuladovacaciones_empleadoid_periodoid_key" ON "acumuladovacaciones"("empleadoid", "periodoid");

-- CreateIndex
CREATE INDEX "idx_anticipos_empleado_estado" ON "anticipossalario"("empleadoid", "estado");

-- CreateIndex
CREATE INDEX "idx_auditoria_tabla_fecha" ON "auditoria"("tabla", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "categoriasclientes_nombre_key" ON "categoriasclientes"("nombre");

-- CreateIndex
CREATE INDEX "idx_cuotas_prestamo_estado" ON "cuotasprestamos"("prestamoid", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "cuotasprestamos_prestamoid_numerocuota_key" ON "cuotasprestamos"("prestamoid", "numerocuota");

-- CreateIndex
CREATE UNIQUE INDEX "departamentosempleados_nombre_key" ON "departamentosempleados"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_cedula_key" ON "empleados"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "liquidacionesempleados_empleadoid_key" ON "liquidacionesempleados"("empleadoid");

-- CreateIndex
CREATE UNIQUE INDEX "mermas_movimientoingresoid_key" ON "mermas"("movimientoingresoid");

-- CreateIndex
CREATE INDEX "idx_planilla_detalle_empleado" ON "planilladetalle"("empleadoid");

-- CreateIndex
CREATE INDEX "idx_planilla_detalle_estado" ON "planilladetalle"("estado");

-- CreateIndex
CREATE INDEX "idx_planilla_detalle_periodo" ON "planilladetalle"("periodoid");

-- CreateIndex
CREATE UNIQUE INDEX "planilladetalle_periodoid_empleadoid_key" ON "planilladetalle"("periodoid", "empleadoid");

-- CreateIndex
CREATE INDEX "idx_prestamos_empleado" ON "prestamosempleados"("empleadoid", "estado");

-- CreateIndex
CREATE INDEX "idx_asistencia_empleado_fecha" ON "registroasistencia"("empleadoid", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "registroasistencia_empleadoid_fecha_key" ON "registroasistencia"("empleadoid", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "unidadesmedida_nombre_key" ON "unidadesmedida"("nombre");

-- AddForeignKey
ALTER TABLE "abonos" ADD CONSTRAINT "abonos_cuentaid_fkey" FOREIGN KEY ("cuentaid") REFERENCES "cuentasporcobrar"("cuentaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_categoriaclienteid_fkey" FOREIGN KEY ("categoriaclienteid") REFERENCES "categoriasclientes"("categoriaclienteid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_ordencompraid_fkey" FOREIGN KEY ("ordencompraid") REFERENCES "ordenescompra"("ordencompraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_proveedorid_fkey" FOREIGN KEY ("proveedorid") REFERENCES "proveedores"("proveedorid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comprasproductos" ADD CONSTRAINT "comprasproductos_compraid_fkey" FOREIGN KEY ("compraid") REFERENCES "compras"("compraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comprasproductos" ADD CONSTRAINT "comprasproductos_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuentasporcobrar" ADD CONSTRAINT "cuentasporcobrar_clienteid_fkey" FOREIGN KEY ("clienteid") REFERENCES "clientes"("clienteid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuentasporcobrar" ADD CONSTRAINT "cuentasporcobrar_ventaid_fkey" FOREIGN KEY ("ventaid") REFERENCES "ventas"("ventaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuentasporpagar" ADD CONSTRAINT "cuentasporpagar_compraid_fkey" FOREIGN KEY ("compraid") REFERENCES "compras"("compraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_repartidorid_fkey" FOREIGN KEY ("repartidorid") REFERENCES "repartidores"("repartidorid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientoscompras" ADD CONSTRAINT "movimientoscompras_compraid_fkey" FOREIGN KEY ("compraid") REFERENCES "compras"("compraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientoscompras" ADD CONSTRAINT "movimientoscompras_movimientocompraid_fkey" FOREIGN KEY ("movimientocompraid") REFERENCES "movimientosinventario"("movimientoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientosinventario" ADD CONSTRAINT "movimientosinventario_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientoventas" ADD CONSTRAINT "movimientoventas_movimeintoventaid_fkey" FOREIGN KEY ("movimeintoventaid") REFERENCES "movimientosinventario"("movimientoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientoventas" ADD CONSTRAINT "movimientoventas_ventaid_fkey" FOREIGN KEY ("ventaid") REFERENCES "ventas"("ventaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagocuentasporpagar" ADD CONSTRAINT "pagocuentasporpagar_cuentapagarid_fkey" FOREIGN KEY ("cuentapagarid") REFERENCES "cuentasporpagar"("cuentapagarid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagocuentasporpagar" ADD CONSTRAINT "pagocuentasporpagar_pagoid_fkey" FOREIGN KEY ("pagoid") REFERENCES "pagos"("pagoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagogastos" ADD CONSTRAINT "pagogastos_gastoid_fkey" FOREIGN KEY ("gastoid") REFERENCES "gastos"("gastoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagogastos" ADD CONSTRAINT "pagogastos_pagoid_fkey" FOREIGN KEY ("pagoid") REFERENCES "pagos"("pagoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaid_fkey" FOREIGN KEY ("categoriaid") REFERENCES "categoriasproductos"("categoriaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_unidadmedidaid_fkey" FOREIGN KEY ("unidadmedidaid") REFERENCES "unidadesmedida"("unidadmedidaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventadelivery" ADD CONSTRAINT "ventadelivery_deliveryid_fkey" FOREIGN KEY ("deliveryid") REFERENCES "deliveries"("deliveryid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventadelivery" ADD CONSTRAINT "ventadelivery_ventaid_fkey" FOREIGN KEY ("ventaid") REFERENCES "ventas"("ventaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventaproductos" ADD CONSTRAINT "ventaproductos_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventaproductos" ADD CONSTRAINT "ventaproductos_ventaid_fkey" FOREIGN KEY ("ventaid") REFERENCES "ventas"("ventaid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_clienteid_fkey" FOREIGN KEY ("clienteid") REFERENCES "clientes"("clienteid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_sesionid_fkey" FOREIGN KEY ("sesionid") REFERENCES "sesiones"("sesionid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladodecimoprimermes" ADD CONSTRAINT "acumuladodecimoprimermes_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladodecimoprimermes" ADD CONSTRAINT "acumuladodecimoprimermes_periodoid_fkey" FOREIGN KEY ("periodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladoindemnizacion" ADD CONSTRAINT "acumuladoindemnizacion_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladoindemnizacion" ADD CONSTRAINT "acumuladoindemnizacion_periodoid_fkey" FOREIGN KEY ("periodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladovacaciones" ADD CONSTRAINT "acumuladovacaciones_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acumuladovacaciones" ADD CONSTRAINT "acumuladovacaciones_periodoid_fkey" FOREIGN KEY ("periodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anticipossalario" ADD CONSTRAINT "anticipossalario_descontadoenperiodoid_fkey" FOREIGN KEY ("descontadoenperiodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anticipossalario" ADD CONSTRAINT "anticipossalario_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anticipossalario" ADD CONSTRAINT "anticipossalario_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargosempleados" ADD CONSTRAINT "cargosempleados_departamentoid_fkey" FOREIGN KEY ("departamentoid") REFERENCES "departamentosempleados"("departamentoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "costosadicionalescompras" ADD CONSTRAINT "costosadicionalescompras_compraid_fkey" FOREIGN KEY ("compraid") REFERENCES "compras"("compraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuotasprestamos" ADD CONSTRAINT "cuotasprestamos_detalleid_fkey" FOREIGN KEY ("detalleid") REFERENCES "planilladetalle"("detalleid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuotasprestamos" ADD CONSTRAINT "cuotasprestamos_prestamoid_fkey" FOREIGN KEY ("prestamoid") REFERENCES "prestamosempleados"("prestamoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "departamentosempleados" ADD CONSTRAINT "fk_jefe_empleado" FOREIGN KEY ("jefeempleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_ventaid_productoid_fkey" FOREIGN KEY ("ventaid", "productoid") REFERENCES "ventaproductos"("ventaid", "productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_cargoid_fkey" FOREIGN KEY ("cargoid") REFERENCES "cargosempleados"("cargoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_departamentoid_fkey" FOREIGN KEY ("departamentoid") REFERENCES "departamentosempleados"("departamentoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historialsalarios" ADD CONSTRAINT "historialsalarios_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historialsalarios" ADD CONSTRAINT "historialsalarios_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenesproductos" ADD CONSTRAINT "imagenesproductos_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "liquidacionesempleados" ADD CONSTRAINT "liquidacionesempleados_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "liquidacionesempleados" ADD CONSTRAINT "liquidacionesempleados_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mermas" ADD CONSTRAINT "mermas_movimientoid_fkey" FOREIGN KEY ("movimientoid") REFERENCES "movimientosinventario"("movimientoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mermas" ADD CONSTRAINT "mermas_movimientoingresoid_fkey" FOREIGN KEY ("movimientoingresoid") REFERENCES "movimientosinventario"("movimientoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mermas" ADD CONSTRAINT "mermas_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mermas" ADD CONSTRAINT "mermas_productodestinoid_fkey" FOREIGN KEY ("productodestinoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mermas" ADD CONSTRAINT "mermas_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordenescompra" ADD CONSTRAINT "ordenescompra_proveedorid_fkey" FOREIGN KEY ("proveedorid") REFERENCES "proveedores"("proveedorid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordenescompraproductos" ADD CONSTRAINT "ordenescompraproductos_ordencompraid_fkey" FOREIGN KEY ("ordencompraid") REFERENCES "ordenescompra"("ordencompraid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordenescompraproductos" ADD CONSTRAINT "ordenescompraproductos_productoid_fkey" FOREIGN KEY ("productoid") REFERENCES "productos"("productoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagosbeneficios" ADD CONSTRAINT "pagosbeneficios_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagosbeneficios" ADD CONSTRAINT "pagosbeneficios_periodoid_fkey" FOREIGN KEY ("periodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagosbeneficios" ADD CONSTRAINT "pagosbeneficios_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "periodosplanilla" ADD CONSTRAINT "periodosplanilla_usuarioaprobacionid_fkey" FOREIGN KEY ("usuarioaprobacionid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planilladeducciones" ADD CONSTRAINT "planilladeducciones_detalleid_fkey" FOREIGN KEY ("detalleid") REFERENCES "planilladetalle"("detalleid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planilladetalle" ADD CONSTRAINT "planilladetalle_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planilladetalle" ADD CONSTRAINT "planilladetalle_periodoid_fkey" FOREIGN KEY ("periodoid") REFERENCES "periodosplanilla"("periodoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planillahorasextra" ADD CONSTRAINT "planillahorasextra_detalleid_fkey" FOREIGN KEY ("detalleid") REFERENCES "planilladetalle"("detalleid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prestamosempleados" ADD CONSTRAINT "prestamosempleados_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prestamosempleados" ADD CONSTRAINT "prestamosempleados_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "registroasistencia" ADD CONSTRAINT "registroasistencia_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudesvacaciones" ADD CONSTRAINT "solicitudesvacaciones_empleadoid_fkey" FOREIGN KEY ("empleadoid") REFERENCES "empleados"("empleadoid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudesvacaciones" ADD CONSTRAINT "solicitudesvacaciones_usuarioaprobacionid_fkey" FOREIGN KEY ("usuarioaprobacionid") REFERENCES "usuarios"("usuarioid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventapagos" ADD CONSTRAINT "ventapagos_ventaid_fkey" FOREIGN KEY ("ventaid") REFERENCES "ventas"("ventaid") ON DELETE NO ACTION ON UPDATE NO ACTION;
